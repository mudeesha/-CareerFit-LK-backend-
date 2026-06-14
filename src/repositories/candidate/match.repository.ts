import { prisma } from "../../lib/prisma";

export async function findCandidateForMatchByUserId(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    include: {
      cvAnalyses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

export async function findJobForMatch(jobId: string) {
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