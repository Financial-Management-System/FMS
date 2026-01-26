import { z } from "zod";

export const roleCreateSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  level: z.enum(['Admin', 'Manager', 'User', 'Viewer']),
  permissions: z.array(z.string()).default([]),
  orgId: z.string().min(1, "Organization ID is required"),
  status: z.enum(['Active', 'Inactive']).default('Active')
});

export const roleUpdateSchema = roleCreateSchema.partial();