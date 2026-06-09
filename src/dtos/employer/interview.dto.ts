import { InterviewStatus, InterviewType } from "@prisma/client";
import { z } from "zod";

export const employerApplicationInterviewParamSchema = z.object({
  id: z.string().trim().min(1, "Application ID is required"),
});

export const employerInterviewParamSchema = z.object({
  id: z.string().trim().min(1, "Interview ID is required"),
});

export const scheduleInterviewSchema = z.object({
  interviewDate: z.string().trim().min(1, "Interview date is required"),
  interviewTime: z.string().trim().min(1, "Interview time is required"),
  interviewType: z.nativeEnum(InterviewType),
  locationOrLink: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const updateInterviewSchema = z.object({
  interviewDate: z.string().trim().min(1).optional(),
  interviewTime: z.string().trim().min(1).optional(),
  interviewType: z.nativeEnum(InterviewType).optional(),
  locationOrLink: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
  status: z
    .enum([InterviewStatus.SCHEDULED, InterviewStatus.COMPLETED])
    .optional(),
});

export type ScheduleInterviewDto = z.infer<typeof scheduleInterviewSchema>;
export type UpdateInterviewDto = z.infer<typeof updateInterviewSchema>;