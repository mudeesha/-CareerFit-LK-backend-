import {
  AdminActionType,
  AdminEntityType,
  CompanyStatus,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findPendingCompanies() {
  return prisma.company.findMany({
    where: {
      status: CompanyStatus.PENDING,
    },
    include: {
      employers: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      jobs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findCompanyById(companyId: string) {
  return prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      employers: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      jobs: {
        include: {
          category: true,
        },
      },
    },
  });
}

export async function updateCompanyStatusRecord(
  companyId: string,
  status: CompanyStatus
) {
  return prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      status,
    },
    include: {
      employers: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      jobs: {
        include: {
          category: true,
        },
      },
    },
  });
}

export async function createCompanyAdminActionRecord(data: {
  adminUserId: string;
  companyId: string;
  action: AdminActionType;
  reason?: string;
}) {
  return prisma.adminAction.create({
    data: {
      adminUserId: data.adminUserId,
      entityType: AdminEntityType.COMPANY,
      entityId: data.companyId,
      action: data.action,
      reason: data.reason,
      companyId: data.companyId,
    },
  });
}