import { prisma } from "../../lib/prisma";
import { UpdateEmployerCompanyDto } from "../../dtos/employer/company.dto";

export async function findEmployerByUserId(userId: string) {
  return prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      company: {
        include: {
          jobs: {
            include: {
              category: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          employers: {
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
            },
          },
        },
      },
    },
  });
}

export async function findEmployerCompanyById(companyId: string) {
  return prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      jobs: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      employers: {
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
        },
      },
    },
  });
}

export async function updateEmployerCompanyRecord(
  companyId: string,
  data: UpdateEmployerCompanyDto
) {
  return prisma.company.update({
    where: {
      id: companyId,
    },
    data,
    include: {
      jobs: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      employers: {
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
        },
      },
    },
  });
}