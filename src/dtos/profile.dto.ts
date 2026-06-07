import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  district: z.string().optional(),
  currentRole: z.string().optional(),
  preferredLocations: z.array(z.string()).optional(),
  expectedSalary: z.number().int().positive().optional(),
  experienceYears: z.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  education: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export const updateEmployerProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  companyId: z.string().optional(),
});

export type UpdateCandidateProfileDto = z.infer<
  typeof updateCandidateProfileSchema
>;

export type UpdateEmployerProfileDto = z.infer<
  typeof updateEmployerProfileSchema
>;

export type UpdateProfileDto =
  | UpdateCandidateProfileDto
  | UpdateEmployerProfileDto;