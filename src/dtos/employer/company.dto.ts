import { z } from "zod";

export const updateEmployerCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name is required").optional(),

  logoText: z.string().trim().min(1, "Logo text is required").optional(),
  logoType: z.string().trim().min(1, "Logo type is required").optional(),
  logoColor: z.string().trim().min(1, "Logo color is required").optional(),

  industry: z.string().trim().min(1, "Industry is required").optional(),
  location: z.string().trim().min(1, "Location is required").optional(),
  size: z.string().trim().optional(),
  website: z.string().trim().optional(),
  description: z.string().trim().optional(),
  contactEmail: z.string().trim().email("Invalid contact email").optional(),
  phone: z.string().trim().optional(),
});

export type UpdateEmployerCompanyDto = z.infer<
  typeof updateEmployerCompanySchema
>;