import { RecurringExpense } from "../../model/recurringExpense.model";
import { ExpenseTransaction } from "../../model/expenseTransaction.model";
import { calcNextRunAt } from "../../lib/recurring/calcNextRunAt";

/**
 * Finds due recurring expenses (nextRunAt <= now) and generates ExpenseTransaction records.
 * Then advances each recurring template's nextRunAt.
 */
export async function runRecurringExpenseJob(params?: {
  now?: Date;
  organizationId?: string; // optional: run per org
  limit?: number;
}) {
  const now = params?.now ?? new Date();
  const limit = params?.limit ?? 500;

  const query: any = {
    status: "active",
    nextRunAt: { $lte: now },
  };

  if (params?.organizationId) {
    query.organization = params.organizationId;
  }

  const dueTemplates = await RecurringExpense.find(query)
    .sort({ nextRunAt: 1 })
    .limit(limit);

  let createdCount = 0;
  let endedCount = 0;

  for (const r of dueTemplates) {
    // If endDate exists and nextRunAt is beyond it -> end it (safety)
    if (r.endDate && r.nextRunAt > r.endDate) {
      r.status = "ended";
      await r.save();
      endedCount++;
      continue;
    }

    /**
     * Duplicate protection:
     * If job runs twice accidentally, we shouldn't create the same transaction twice
     * for the same template + date.
     */
    const alreadyExists = await ExpenseTransaction.exists({
      organization: r.organization,
      sourceRecurringExpense: r._id,
      date: r.nextRunAt,
    });

    if (!alreadyExists) {
      await ExpenseTransaction.create({
        organization: r.organization,
        sourceRecurringExpense: r._id,
        date: r.nextRunAt,
        amount: r.amount,
        currency: r.currency,
        category: r.category,
        vendor: r.vendor,
        notes: `Auto-generated from recurring expense: ${r.name}`,
        status: r.autoPost ? "paid" : "pending",
        createdBy: r.createdBy,
      });
      createdCount++;
    }

    // Advance schedule (THIS is where Step 3 is used)
    const newNextRunAt = calcNextRunAt({
      from: r.nextRunAt,
      frequency: r.frequency,
      interval: r.interval,
      dayOfWeek: r.dayOfWeek,
      dayOfMonth: r.dayOfMonth,
    });

    r.lastRunAt = r.nextRunAt;
    r.nextRunAt = newNextRunAt;

    // If next run exceeds endDate => end it
    if (r.endDate && r.nextRunAt > r.endDate) {
      r.status = "ended";
      endedCount++;
    }

    await r.save();
  }

  return {
    ok: true,
    now,
    processedTemplates: dueTemplates.length,
    createdTransactions: createdCount,
    endedTemplates: endedCount,
  };
}
