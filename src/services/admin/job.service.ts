import { AdminActionType, JobStatus } from "@prisma/client";
import {
  createJobAdminActionRecord,
  findAdminJobById,
  findPendingJobs,
  updateJobFeaturedRecord,
  updateJobStatusRecord,
} from "../../repositories/admin/job.repository";
import { AppError } from "../../utils/appError";

async function getJobOrFail(jobId: string) {
  const job = await findAdminJobById(jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  return job;
}

export async function getPendingJobsService() {
  const jobs = await findPendingJobs();

  return {
    items: jobs,
    count: jobs.length,
  };
}

export async function approveJobService(adminUserId: string, jobId: string) {
  const job = await getJobOrFail(jobId);

  if (job.status === JobStatus.ACTIVE) {
    throw new AppError("JOB_ALREADY_ACTIVE", "Job is already active", 400);
  }

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("JOB_CLOSED", "Closed job cannot be approved", 400);
  }

  if (job.status === JobStatus.REJECTED) {
    throw new AppError(
      "JOB_REJECTED",
      "Rejected job cannot be approved directly",
      400
    );
  }

  const updatedJob = await updateJobStatusRecord(job.id, JobStatus.ACTIVE);

  await createJobAdminActionRecord({
    adminUserId,
    jobId: job.id,
    action: AdminActionType.APPROVED,
  });

  return updatedJob;
}

export async function rejectJobService(
  adminUserId: string,
  jobId: string,
  reason: string
) {
  const job = await getJobOrFail(jobId);

  if (job.status === JobStatus.REJECTED) {
    throw new AppError("JOB_ALREADY_REJECTED", "Job is already rejected", 400);
  }

  if (job.status === JobStatus.ACTIVE) {
    throw new AppError(
      "JOB_ALREADY_ACTIVE",
      "Active job cannot be rejected. Close it instead.",
      400
    );
  }

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("JOB_CLOSED", "Closed job cannot be rejected", 400);
  }

  const updatedJob = await updateJobStatusRecord(job.id, JobStatus.REJECTED);

  await createJobAdminActionRecord({
    adminUserId,
    jobId: job.id,
    action: AdminActionType.REJECTED,
    reason,
  });

  return updatedJob;
}

export async function featureJobService(
  adminUserId: string,
  jobId: string,
  requestedFeatured?: boolean
) {
  const job = await getJobOrFail(jobId);

  if (job.status !== JobStatus.ACTIVE) {
    throw new AppError(
      "JOB_NOT_ACTIVE",
      "Only active jobs can be featured",
      400
    );
  }

  const nextFeatured =
    requestedFeatured === undefined ? !job.isFeatured : requestedFeatured;

  const updatedJob = await updateJobFeaturedRecord(job.id, nextFeatured);

  if (nextFeatured) {
    await createJobAdminActionRecord({
      adminUserId,
      jobId: job.id,
      action: AdminActionType.FEATURED,
    });
  }

  return updatedJob;
}

export async function closeJobService(
  adminUserId: string,
  jobId: string,
  reason?: string
) {
  const job = await getJobOrFail(jobId);

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("JOB_ALREADY_CLOSED", "Job is already closed", 400);
  }

  if (job.status === JobStatus.REJECTED) {
    throw new AppError("JOB_REJECTED", "Rejected job cannot be closed", 400);
  }

  const updatedJob = await updateJobStatusRecord(job.id, JobStatus.CLOSED);

  await createJobAdminActionRecord({
    adminUserId,
    jobId: job.id,
    action: AdminActionType.CLOSED,
    reason,
  });

  return updatedJob;
}