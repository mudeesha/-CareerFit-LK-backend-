import { GetJobsQueryDto } from "../dtos/job.dto";
import { findJobById, findJobs } from "../repositories/job.repository";
import { AppError } from "../utils/appError";

export async function getJobsService(filters: GetJobsQueryDto) {
  const jobs = await findJobs(filters);

  return {
    items: jobs,
    count: jobs.length,
  };
}

export async function getJobByIdService(id: string) {
  const job = await findJobById(id);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  return job;
}