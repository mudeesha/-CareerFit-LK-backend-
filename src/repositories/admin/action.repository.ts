import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { GetAdminActionsQueryDto } from "../../dtos/admin/action.dto";

export async function findAdminActions(filters: GetAdminActionsQueryDto) {
  const where: Prisma.AdminActionWhereInput = {};

  if (filters.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters.companyId) {
    where.companyId = filters.companyId;
  }

  if (filters.jobId) {
    where.jobId = filters.jobId;
  }

  return prisma.adminAction.findMany({
    where,
    include: {
      company: true,
      job: {
        include: {
          company: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: filters.limit,
  });
}