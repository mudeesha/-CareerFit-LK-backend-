import { prisma } from "../../lib/prisma";

export async function findCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}