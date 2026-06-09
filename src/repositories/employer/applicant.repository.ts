import { ApplicationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findEmployerByUserId(userId: string) {
  return prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      company: true,
    },
  });
}

export async function findEmployerJobById(companyId: string, jobId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      companyId,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function findApplicantsByJobId(jobId: string) {
  return prisma.application.findMany({
    where: {
      jobId,
    },
    include: {
      candidate: {
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
          cvAnalyses: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      job: {
        include: {
          company: true,
          category: true,
        },
      },
      interview: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}

export async function findApplicationForEmployer(
  companyId: string,
  applicationId: string
) {
  return prisma.application.findFirst({
    where: {
      id: applicationId,
      job: {
        companyId,
      },
    },
    include: {
      candidate: {
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
          cvAnalyses: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      job: {
        include: {
          company: true,
          category: true,
        },
      },
      interview: true,
    },
  });
}

export async function updateApplicationStatusRecord(
  applicationId: string,
  status: ApplicationStatus
) {
  return prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status,
    },
    include: {
      candidate: {
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
          cvAnalyses: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      job: {
        include: {
          company: true,
          category: true,
        },
      },
      interview: true,
    },
  });
}