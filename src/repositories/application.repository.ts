import { prisma } from "../lib/prisma";

export async function findCandidateByUserId(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
  });
}

export async function findJobForApplication(jobId: string) {
  return prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function findApplicationByCandidateAndJob(
  candidateId: string,
  jobId: string
) {
  return prisma.application.findFirst({
    where: {
      candidateId,
      jobId,
    },
  });
}

export async function createApplicationRecord(data: {
  candidateId: string;
  jobId: string;
  coverLetter: string;
  matchScore?: number;
}) {
  return prisma.application.create({
    data: {
      candidateId: data.candidateId,
      jobId: data.jobId,
      coverLetter: data.coverLetter,
      matchScore: data.matchScore,
      status: "APPLIED",
    },
    include: {
      job: {
        include: {
          company: true,
          category: true,
        },
      },
      candidate: true,
    },
  });
}

export async function findMyApplications(candidateId: string) {
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
  });
}

export async function findApplicationById(applicationId: string) {
  return prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });
}

export async function withdrawApplicationRecord(applicationId: string) {
  return prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: "WITHDRAWN",
      withdrawnAt: new Date(),
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

export async function incrementJobApplicantCount(jobId: string) {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      applicantCount: {
        increment: 1,
      },
    },
  });
}