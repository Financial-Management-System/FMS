import { Schema, model, models, Types } from "mongoose";

export type ExpenseStatus = "pending" | "paid" | "cancelled";

const ExpenseTransactionSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      ref: "organization",
      required: true,
      index: true,
    },

    // Link back to template (optional but recommended)
    sourceRecurringExpense: {
      type: Types.ObjectId,
      ref: "RecurringExpense",
      default: null,
      index: true,
    },

    date: { type: Date, required: true, index: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: "LKR" },

    category: { type: String, required: true, trim: true },
    vendor: { type: String, default: "", trim: true },

    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
      index: true,
    },

    createdBy: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

ExpenseTransactionSchema.index({ organization: 1, date: -1 });
ExpenseTransactionSchema.index({ organization: 1, category: 1 });

export const ExpenseTransaction =
  models.ExpenseTransaction ||
  model("ExpenseTransaction", ExpenseTransactionSchema);
