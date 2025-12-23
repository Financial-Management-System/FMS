import { z } from "zod";

export const organizationCreateSchema = z.object({
//   org_id: z.string().min(3, "Organization ID must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  country: z.string().min(2, "Country is required"),
  timezone: z.string().min(2, "Timezone is required"),
  status: z.enum(["active", "inactive"]).optional(),
});
