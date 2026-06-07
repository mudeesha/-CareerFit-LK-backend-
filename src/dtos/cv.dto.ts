import { z } from "zod";

export const analyzeCvSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().optional(),
});

export type AnalyzeCvDto = z.infer<typeof analyzeCvSchema>;