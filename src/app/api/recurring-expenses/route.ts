import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import { RecurringExpense } from "../../../model/recurringExpense.model";
import { calcNextRunAt } from "../../../lib/recurring/calcNextRunAt";

// GET /api/recurring-expenses?organizationId=...&status=active
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const organizationId = searchParams.get("organizationId");
  const status = searchParams.get("status"); // optional: active/paused/ended
  const q = searchParams.get("q"); // optional: search name/vendor
  const limit = Number(searchParams.get("limit") ?? "50");

  if (!organizationId) {
    return NextResponse.json(
      { ok: false, message: "organizationId is required" },
      { status: 400 }
    );
  }

  const filter: any = { organization: organizationId };

  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { vendor: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const data = await RecurringExpense.find(filter)
    .sort({ nextRunAt: 1 })
    .limit(Math.min(limit, 200));

  return NextResponse.json({ ok: true, data });
}

// POST /api/recurring-expenses
export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  // MVP: get these from request (later get from auth token/session)
  const organizationId = body.organizationId;
  const userId = body.userId;

  if (!organizationId || !userId) {
    return NextResponse.json(
      { ok: false, message: "organizationId and userId are required" },
      { status: 400 }
    );
  }

  if (!body.name || !body.category || body.amount === undefined || !body.frequency) {
    return NextResponse.json(
      { ok: false, message: "name, category, amount, frequency are required" },
      { status: 400 }
    );
  }

  const startDate = new Date(body.startDate ?? new Date());

  // Best practice: first run at startDate (so it generates on start date)
  const nextRunAt =
    body.nextRunAt
      ? new Date(body.nextRunAt)
      : startDate;

  // Optional: if you want nextRunAt to be computed (NOT recommended for first run)
  // const nextRunAt = calcNextRunAt({ from: startDate, ... })

  const doc = await RecurringExpense.create({
    organization: organizationId,
    createdBy: userId,

    name: body.name,
    category: body.category,
    vendor: body.vendor ?? "",

    amount: Number(body.amount),
    currency: body.currency ?? "LKR",

    startDate,
    endDate: body.endDate ? new Date(body.endDate) : null,

    frequency: body.frequency,
    interval: body.interval ?? 1,

    dayOfWeek: body.dayOfWeek ?? null,
    dayOfMonth: body.dayOfMonth ?? null,

    nextRunAt,
    lastRunAt: null,

    autoPost: body.autoPost ?? true,
    paymentMethod: body.paymentMethod ?? "Cash",

    status: "active",
  });

  return NextResponse.json({ ok: true, data: doc }, { status: 201 });
}
