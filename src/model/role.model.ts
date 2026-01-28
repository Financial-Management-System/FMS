import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String }],
    orgId: { type: String, required: true },
    status: { 
      type: String, 
      default: 'Active', 
      enum: ['Active', 'Inactive'] 
    }
  },
  { timestamps: true }
);

export const Role = models.Role || model("Role", RoleSchema);