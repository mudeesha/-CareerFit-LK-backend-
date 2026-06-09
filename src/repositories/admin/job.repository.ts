import {
  AdminActionType,
  AdminEntityType,
  JobStatus,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findPendingJobs() {
  return prisma.job.findMany({
    where: {
      status: JobStatus.PENDING_APPROVAL,
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

export async function findAdminJobById(jobId: string) {
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

export async function updateJobStatusRecord(jobId: string, status: JobStatus) {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      status,
      postedDate: status === JobStatus.ACTIVE ? "Just now" : undefined,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function updateJobFeaturedRecord(
  jobId: string,
  isFeatured: boolean
) {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      isFeatured,
    },
    include: {
      company: true,
      category: true,
    },
  });
}

export async function createJobAdminActionRecord(data: {
  adminUserId: string;
  jobId: string;
  action: AdminActionType;
  reason?: string;
}) {
  return prisma.adminAction.create({
    data: {
      adminUserId: data.adminUserId,
      entityType: AdminEntityType.JOB,
      entityId: data.jobId,
      action: data.action,
      reason: data.reason,
      jobId: data.jobId,
    },
  });
}