import {
  AdminActionType,
  CompanyStatus,
  JobStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function countCandidates() {
  return prisma.user.count({
    where: {
      role: UserRole.CANDIDATE,
    },
  });
}

export async function countEmployers() {
  return prisma.user.count({
    where: {
      role: UserRole.EMPLOYER,
    },
  });
}

export async function countActiveJobs() {
  return prisma.job.count({
    where: {
      status: JobStatus.ACTIVE,
    },
  });
}

export async function countPendingCompanies() {
  return prisma.company.count({
    where: {
      status: CompanyStatus.PENDING,
    },
  });
}

export async function countPendingJobs() {
  return prisma.job.count({
    where: {
      status: JobStatus.PENDING_APPROVAL,
    },
  });
}

export async function findApplicationsForTrend() {
  return prisma.application.findMany({
    select: {
      appliedAt: true,
    },
    orderBy: {
      appliedAt: "asc",
    },
  });
}

export async function findCvMissingSkills() {
  return prisma.cvAnalysis.findMany({
    select: {
      missingSkills: true,
    },
  });
}

export async function findRecentPendingJobs() {
  return prisma.job.findMany({
    where: {
      status: JobStatus.PENDING_APPROVAL,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });
}

export async function findRecentPendingCompanies() {
  return prisma.company.findMany({
    where: {
      status: CompanyStatus.PENDING,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });
}

export async function findRecentApplications() {
  return prisma.application.findMany({
    include: {
      candidate: true,
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
    take: 3,
  });
}

export async function findRecentAdminActions() {
  return prisma.adminAction.findMany({
    include: {
      company: true,
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export function mapAdminActionTypeToActivityType(action: AdminActionType) {
  if (action === AdminActionType.APPROVED) {
    return "success";
  }

  if (
    action === AdminActionType.REJECTED ||
    action === AdminActionType.SUSPENDED ||
    action === AdminActionType.CLOSED
  ) {
    return "error";
  }

  return "info";
}