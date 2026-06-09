import { ApplicationStatus, InterviewStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ScheduleInterviewDto,
  UpdateInterviewDto,
} from "../../dtos/employer/interview.dto";

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

export async function findInterviewForEmployer(
  companyId: string,
  interviewId: string
) {
  return prisma.interview.findFirst({
    where: {
      id: interviewId,
      application: {
        job: {
          companyId,
        },
      },
    },
    include: {
      application: {
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
        },
      },
    },
  });
}

export async function createInterviewRecord(
  applicationId: string,
  data: ScheduleInterviewDto
) {
  return prisma.interview.create({
    data: {
      applicationId,
      interviewDate: data.interviewDate,
      interviewTime: data.interviewTime,
      interviewType: data.interviewType,
      locationOrLink: data.locationOrLink,
      notes: data.notes,
      status: InterviewStatus.SCHEDULED,
    },
    include: {
      application: {
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
        },
      },
    },
  });
}

export async function updateApplicationStatusToInterviewScheduled(
  applicationId: string
) {
  return prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
    },
  });
}

export async function updateInterviewRecord(
  interviewId: string,
  data: UpdateInterviewDto
) {
  return prisma.interview.update({
    where: {
      id: interviewId,
    },
    data,
    include: {
      application: {
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
        },
      },
    },
  });
}

export async function cancelInterviewRecord(interviewId: string) {
  return prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status: InterviewStatus.CANCELLED,
    },
    include: {
      application: {
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
        },
      },
    },
  });
}