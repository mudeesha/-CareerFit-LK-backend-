import { JobStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findCandidateByUserId(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });
}

export async function findActiveJobById(jobId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      status: JobStatus.ACTIVE,
    },
  });
}

export async function findSavedJob(candidateId: string, jobId: string) {
  return prisma.savedJob.findUnique({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId,
      },
    },
  });
}

export async function createSavedJobRecord(candidateId: string, jobId: string) {
  return prisma.savedJob.create({
    data: {
      candidateId,
      jobId,
    },
    include: {
      job: {
        include: {
          company: true,
          category: true,
        },
      },
    },
  });
}

export async function findSavedJobsByCandidate(candidateId: string) {
  return prisma.savedJob.findMany({
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
      createdAt: "desc",
    },
  });
}

export async function deleteSavedJobRecord(candidateId: string, jobId: string) {
  return prisma.savedJob.delete({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId,
      },
    },
  });
}