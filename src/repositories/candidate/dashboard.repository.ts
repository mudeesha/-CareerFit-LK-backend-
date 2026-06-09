import { ApplicationStatus, JobStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findCandidateDashboardProfile(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
      cvAnalyses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

export async function countCandidateApplications(candidateId: string) {
  return prisma.application.count({
    where: {
      candidateId,
    },
  });
}

export async function countCandidateShortlistedApplications(candidateId: string) {
  return prisma.application.count({
    where: {
      candidateId,
      status: ApplicationStatus.SHORTLISTED,
    },
  });
}

export async function countCandidateSavedJobs(candidateId: string) {
  return prisma.savedJob.count({
    where: {
      candidateId,
    },
  });
}

export async function findRecentCandidateApplications(candidateId: string) {
  return prisma.application.findMany({
    where: {
      candidateId,
    },
    include: {
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
    take: 3,
  });
}

export async function findCandidateAppliedJobIds(candidateId: string) {
  return prisma.application.findMany({
    where: {
      candidateId,
      status: {
        not: ApplicationStatus.WITHDRAWN,
      },
    },
    select: {
      jobId: true,
    },
  });
}

export async function findRecommendedJobs(excludedJobIds: string[]) {
  return prisma.job.findMany({
    where: {
      status: JobStatus.ACTIVE,
      id: excludedJobIds.length
        ? {
            notIn: excludedJobIds,
          }
        : undefined,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: [
      {
        isFeatured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 6,
  });
}

export async function findPlatformActiveJobsForSkillInsights() {
  return prisma.job.findMany({
    where: {
      status: JobStatus.ACTIVE,
    },
    select: {
      skills: true,
    },
  });
}