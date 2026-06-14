import { z } from "zod";

export const uploadCvAnalysisSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().optional(),
  extractedSkills: z.array(z.string()).optional(),
  experienceYears: z.number().min(0).optional(),
  education: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type UploadCvAnalysisDto = z.infer<typeof uploadCvAnalysisSchema>;