import { ApplicationStatus, CompanyStatus, JobStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findEmployerDashboardProfile(userId: string) {
  return prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      company: true,
    },
  });
}

export async function countEmployerActiveJobs(companyId: string) {
  return prisma.job.count({
    where: {
      companyId,
      status: JobStatus.ACTIVE,
    },
  });
}

export async function countEmployerPendingReviewJobs(companyId: string) {
  return prisma.job.count({
    where: {
      companyId,
      status: JobStatus.PENDING_APPROVAL,
    },
  });
}

export async function countEmployerApplications(companyId: string) {
  return prisma.application.count({
    where: {
      job: {
        companyId,
      },
    },
  });
}

export async function countEmployerShortlistedApplications(companyId: string) {
  return prisma.application.count({
    where: {
      status: ApplicationStatus.SHORTLISTED,
      job: {
        companyId,
      },
    },
  });
}

export async function findEmployerApplicationsForTrend(companyId: string) {
  return prisma.application.findMany({
    where: {
      job: {
        companyId,
      },
    },
    select: {
      appliedAt: true,
    },
    orderBy: {
      appliedAt: "asc",
    },
  });
}

export async function findEmployerRecentApplicants(companyId: string) {
  return prisma.application.findMany({
    where: {
      job: {
        companyId,
      },
    },
    include: {
      candidate: true,
      job: {
        include: {
          company: true,
          category: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
    take: 5,
  });
}

export async function findEmployerActiveJobs(companyId: string) {
  return prisma.job.findMany({
    where: {
      companyId,
      status: JobStatus.ACTIVE,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export { CompanyStatus };