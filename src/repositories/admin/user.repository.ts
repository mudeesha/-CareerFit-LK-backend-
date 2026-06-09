import { Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { GetAdminUsersQueryDto } from "../../dtos/admin/user.dto";

export async function findAdminUsers(filters: GetAdminUsersQueryDto) {
  const where: Prisma.UserWhereInput = {};

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.keyword) {
    where.OR = [
      {
        email: {
          contains: filters.keyword,
        },
      },
      {
        candidateProfile: {
          fullName: {
            contains: filters.keyword,
          },
        },
      },
      {
        employerProfile: {
          fullName: {
            contains: filters.keyword,
          },
        },
      },
      {
        employerProfile: {
          company: {
            name: {
              contains: filters.keyword,
            },
          },
        },
      },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      candidateProfile: true,
      employerProfile: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findUserForAdminById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      candidateProfile: true,
      employerProfile: {
        include: {
          company: true,
        },
      },
    },
  });
}

export async function updateUserStatusRecord(
  userId: string,
  status: UserStatus
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      candidateProfile: true,
      employerProfile: {
        include: {
          company: true,
        },
      },
    },
  });
}