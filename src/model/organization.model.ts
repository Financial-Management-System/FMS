import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema(
  {
    org_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    industry: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    timezone: { type: String, required: true },
   
    status: { type: String, required: true, enum: ['active', 'inactive'] },
  },
  { timestamps: true }
);


export const Organization = models.Organization || model("Organization", OrganizationSchema);