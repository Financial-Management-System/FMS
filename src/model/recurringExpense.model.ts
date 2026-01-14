import { Schema, model, models, Types } from "mongoose";

export type Frequency = "daily" | "weekly" | "monthly" | "yearly";
export type RecurringStatus = "active" | "paused" | "ended";

const RecurringExpenseSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      ref: "organization",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    vendor: { type: String, default: "", trim: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: "LKR" },

    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    interval: { type: Number, default: 1, min: 1 },

    // Weekly schedule: 0=Sun ... 6=Sat
    dayOfWeek: { type: Number, default: null, min: 0, max: 6 },

    // Monthly schedule: recommend 1-28 (avoid month overflow)
    dayOfMonth: { type: Number, default: null, min: 1, max: 31 },

    nextRunAt: { type: Date, required: true, index: true },
    lastRunAt: { type: Date, default: null },

    autoPost: { type: Boolean, default: true },
    paymentMethod: { type: String, default: "Cash", trim: true },

    status: {
      type: String,
      enum: ["active", "paused", "ended"],
      default: "active",
      index: true,
    },

    createdBy: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

// Helpful compound index for the generator job
RecurringExpenseSchema.index({ status: 1, nextRunAt: 1, organization: 1 });

export const RecurringExpense =
  models.RecurringExpense || model("RecurringExpense", RecurringExpenseSchema);
