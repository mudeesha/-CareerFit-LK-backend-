import { z } from "zod";

export const employerJobApplicantParamSchema = z.object({
  id: z.string().trim().min(1, "Job ID is required"),
});

export const employerApplicationParamSchema = z.object({
  id: z.string().trim().min(1, "Application ID is required"),
});

export const rejectApplicationSchema = z.object({
  reason: z.string().trim().max(1000).optional(),
});

export type RejectApplicationDto = z.infer<typeof rejectApplicationSchema>;