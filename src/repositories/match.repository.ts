import { prisma } from "../lib/prisma";

const DEMO_CANDIDATE_EMAIL = "nimal.perera@example.com";

export async function findDemoCandidateForMatch() {
  return prisma.candidateProfile.findFirst({
    where: {
      user: {
        email: DEMO_CANDIDATE_EMAIL,
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