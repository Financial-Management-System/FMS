import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    organizationId: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['income', 'expense'] 
    },
    title: { type: String, required: true },
    source: { type: String }, // For income
    vendor: { type: String }, // For expense
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    description: { type: String, required: true },
    date: { type: Date, required: true }, // receivedDate for income, expenseDate for expense
    referenceNumber: { type: String }, // invoiceNumber for income, receiptNumber for expense
    client: { type: String }, // For income
    department: { type: String }, // For expense
    status: { 
      type: String, 
      required: true, 
      enum: ['Received', 'Pending', 'Overdue', 'Approved', 'Rejected'],
      default: 'Pending'
    },
  },
  { timestamps: true }
);

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);