import { z } from "zod";

export const savedJobParamSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required"),
});

export type SavedJobParamDto = z.infer<typeof savedJobParamSchema>;