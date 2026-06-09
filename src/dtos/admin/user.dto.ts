import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

export const adminUserParamSchema = z.object({
  id: z.string().trim().min(1, "User ID is required"),
});

export const getAdminUsersQuerySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  keyword: z.string().trim().optional(),
});

export type GetAdminUsersQueryDto = z.infer<typeof getAdminUsersQuerySchema>;