import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;