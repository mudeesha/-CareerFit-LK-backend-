import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { GetJobsQueryDto } from "../../dtos/public/job.dto";

export async function findJobs(filters: GetJobsQueryDto) {
  const where: Prisma.JobWhereInput = {
    status: "ACTIVE",
  };

  if (filters.category) {
    where.category = {
      name: filters.category,
    };
  }

  if (filters.company) {
    where.company = {
      name: filters.company,
    };
  }

  if (filters.location) {
    where.location = filters.location;
  }

  if (filters.workMode) {
    where.workMode = filters.workMode as any;
  }

  if (filters.jobType) {
    where.jobType = filters.jobType as any;
  }

  if (filters.experienceLevel) {
    where.experienceLevel = filters.experienceLevel as any;
  }

  if (filters.salaryMin) {
    where.salaryMax = {
      gte: filters.salaryMin,
    };
  }

  if (filters.salaryMax) {
    where.salaryMin = {
      lte: filters.salaryMax,
    };
  }

  if (filters.keyword) {
    where.OR = [
      {
        title: {
          contains: filters.keyword,
        },
      },
      {
        company: {
          name: {
            contains: filters.keyword,
          },
        },
      },
    ];
  }

  return prisma.job.findMany({
    where,
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findJobById(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      category: true,
    },
  });
}