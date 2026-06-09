import { z } from "zod";

export const companyIdParamSchema = z.object({
  id: z.string().trim().min(1, "Company ID is required"),
});

export type CompanyIdParamDto = z.infer<typeof companyIdParamSchema>;