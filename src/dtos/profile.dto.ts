import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  district: z.string().optional(),
  currentRole: z.string().optional(),
  preferredLocations: z.array(z.string()).optional(),
  expectedSalary: z.number().positive().optional(),
  experienceYears: z.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  education: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  profileImageUrl: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;