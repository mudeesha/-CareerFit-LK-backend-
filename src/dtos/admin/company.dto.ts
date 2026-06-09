import { z } from "zod";

export const adminCompanyParamSchema = z.object({
  id: z.string().trim().min(1, "Company ID is required"),
});

export const rejectCompanySchema = z.object({
  reason: z.string().trim().min(1, "Reject reason is required").max(1000),
});

export const suspendCompanySchema = z.object({
  reason: z.string().trim().min(1, "Suspend reason is required").max(1000),
});

export type RejectCompanyDto = z.infer<typeof rejectCompanySchema>;
export type SuspendCompanyDto = z.infer<typeof suspendCompanySchema>;