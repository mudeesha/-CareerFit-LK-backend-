import { AdminActionType, AdminEntityType } from "@prisma/client";
import { z } from "zod";

export const getAdminActionsQuerySchema = z.object({
  entityType: z.nativeEnum(AdminEntityType).optional(),
  action: z.nativeEnum(AdminActionType).optional(),
  entityId: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
  jobId: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GetAdminActionsQueryDto = z.infer<
  typeof getAdminActionsQuerySchema
>;