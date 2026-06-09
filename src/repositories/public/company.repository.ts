import { prisma } from "../../lib/prisma";

export async function findCompanies() {
  return prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findCompanyById(id: string) {
  return prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      jobs: {
        include: {
          category: true,
        },
      },
    },
  });
}