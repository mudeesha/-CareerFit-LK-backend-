import {
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkMode,
} from "@prisma/client";
import { z } from "zod";

const stringArraySchema = z.array(z.string().trim().min(1));

export const employerJobParamSchema = z.object({
  id: z.string().trim().min(1, "Job ID is required"),
});

export const createEmployerJobSchema = z
  .object({
    title: z.string().trim().min(2, "Job title is required"),
    categoryId: z.string().trim().min(1, "Category is required"),

    location: z.string().trim().min(1, "Location is required"),
    workMode: z.nativeEnum(WorkMode),
    jobType: z.nativeEnum(JobType),
    experienceLevel: z.nativeEnum(ExperienceLevel),

    salaryMin: z.coerce.number().int().min(0, "Minimum salary is required"),
    salaryMax: z.coerce.number().int().min(0, "Maximum salary is required"),

    skills: stringArraySchema.min(1, "At least one skill is required"),
    preferredSkills: stringArraySchema.optional(),

    description: z.string().trim().optional(),
    responsibilities: stringArraySchema.optional(),
    benefits: stringArraySchema.optional(),

    status: z
      .enum([JobStatus.DRAFT, JobStatus.PENDING_APPROVAL])
      .default(JobStatus.PENDING_APPROVAL),
  })
  .refine((data) => data.salaryMin <= data.salaryMax, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["salaryMin"],
  });

export const updateEmployerJobSchema = z
  .object({
    title: z.string().trim().min(2, "Job title is required").optional(),
    categoryId: z.string().trim().min(1, "Category is required").optional(),

    location: z.string().trim().min(1, "Location is required").optional(),
    workMode: z.nativeEnum(WorkMode).optional(),
    jobType: z.nativeEnum(JobType).optional(),
    experienceLevel: z.nativeEnum(ExperienceLevel).optional(),

    salaryMin: z.coerce.number().int().min(0).optional(),
    salaryMax: z.coerce.number().int().min(0).optional(),

    skills: stringArraySchema.min(1, "At least one skill is required").optional(),
    preferredSkills: stringArraySchema.optional(),

    description: z.string().trim().optional(),
    responsibilities: stringArraySchema.optional(),
    benefits: stringArraySchema.optional(),

    status: z.enum([JobStatus.DRAFT, JobStatus.PENDING_APPROVAL]).optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["salaryMin"],
    }
  );

export type CreateEmployerJobDto = z.infer<typeof createEmployerJobSchema>;
export type UpdateEmployerJobDto = z.infer<typeof updateEmployerJobSchema>;