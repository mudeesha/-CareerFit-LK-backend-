import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required"),
  coverLetter: z
    .string()
    .trim()
    .min(10, "Cover letter must be at least 10 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
});

export const applicationIdParamSchema = z.object({
  id: z.string().trim().min(1, "Application ID is required"),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
export type ApplicationIdParamDto = z.infer<typeof applicationIdParamSchema>;