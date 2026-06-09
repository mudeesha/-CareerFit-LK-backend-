import { z } from "zod";

export const getJobsQuerySchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  workMode: z.string().optional(),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
});

export const jobIdParamSchema = z.object({
  id: z.string().trim().min(1, "Job ID is required"),
});

export type GetJobsQueryDto = z.infer<typeof getJobsQuerySchema>;
export type JobIdParamDto = z.infer<typeof jobIdParamSchema>;