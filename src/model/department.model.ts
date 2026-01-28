import { Schema, model, models } from "mongoose";

const DepartmentSchema = new Schema(
  {
    org_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    manager: { type: String, required: true },
    budget: { type: Number, required: true, default: 0 },
    spent: { type: Number, default: 0 },
    memberCount: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['Active', 'Inactive'], 
      default: 'Active' 
    },
  },
  { timestamps: true }
);

// Create index for faster queries
DepartmentSchema.index({ org_id: 1 });
DepartmentSchema.index({ name: 1 });

export const Department = models.Department || model("Department", DepartmentSchema);
