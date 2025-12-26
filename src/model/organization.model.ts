import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema(
  {
    org_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: false },
    country: { type: String, required: true },
    timezone: { type: String, required: true },
    employees: { type: Number, required: false },
    revenue: { type: String, required: false },
    image: { type: String, required: false },
    status: { type: String, required: true, enum: ['Active', 'Pending', 'Inactive', 'active', 'inactive'] },
  },
  { timestamps: true }
);


export const Organization = models.Organization || model("Organization", OrganizationSchema);