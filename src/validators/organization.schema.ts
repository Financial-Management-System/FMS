import { z } from "zod";

export const organizationCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  country: z.string().min(2, "Country is required"),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  employees: z.coerce.number().min(1, "Number of employees must be at least 1").optional(),
  revenue: z.string().min(1, "Revenue is required").optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  status: z.enum(["Active", "Pending", "Inactive"]).optional(),
  // Backend fields (auto-generated or optional)
  code: z.string().optional(),
  industry: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().optional(),
});
