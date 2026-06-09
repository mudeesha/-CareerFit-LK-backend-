import { z } from "zod";

export const adminJobParamSchema = z.object({
  id: z.string().trim().min(1, "Job ID is required"),
});

export const rejectJobSchema = z.object({
  reason: z.string().trim().min(1, "Reject reason is required").max(1000),
});

export const closeJobSchema = z.object({
  reason: z.string().trim().max(1000).optional(),
});

export const featureJobSchema = z.object({
  isFeatured: z.boolean().optional(),
});

export type RejectJobDto = z.infer<typeof rejectJobSchema>;
export type CloseJobDto = z.infer<typeof closeJobSchema>;
export type FeatureJobDto = z.infer<typeof featureJobSchema>;