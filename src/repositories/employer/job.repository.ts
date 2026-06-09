import { JobStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  CreateEmployerJobDto,
  UpdateEmployerJobDto,
} from "../../dtos/employer/job.dto";

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

export async function findCategoryById(categoryId: string) {
  return prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
}

export async function findEmployerJobs(companyId: string) {
  return prisma.job.findMany({
    where: {
      companyId,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
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

export async function createEmployerJobRecord(
  companyId: string,
  data: CreateEmployerJobDto
) {
  return prisma.job.create({
    data: {
      companyId,
      categoryId: data.categoryId,

      title: data.title,
      location: data.location,
      workMode: data.workMode,
      jobType: data.jobType,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      experienceLevel: data.experienceLevel,

      skills: data.skills,
      preferredSkills: data.preferredSkills,
      description: data.description,
      responsibilities: data.responsibilities,
      benefits: data.benefits,

      status: data.status,
      postedDate:
        data.status === JobStatus.PENDING_APPROVAL ? "Pending review" : undefined,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function updateEmployerJobRecord(
  jobId: string,
  data: UpdateEmployerJobDto
) {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      ...data,
      postedDate:
        data.status === JobStatus.PENDING_APPROVAL ? "Pending review" : undefined,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function closeEmployerJobRecord(jobId: string) {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      status: JobStatus.CLOSED,
    },
    include: {
      company: true,
      category: true,
    },
  });
}