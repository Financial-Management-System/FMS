import { Schema, model, models } from "mongoose";

const BudgetSchema = new Schema(
  {
    organizationId: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    category: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    period: { 
      type: String, 
      required: true, 
      enum: ['Monthly', 'Quarterly', 'Annually'] 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['On Track', 'At Risk', 'Over Budget'],
      default: 'On Track'
    },
  },
  { timestamps: true }
);

export const Budget = models.Budget || model("Budget", BudgetSchema);