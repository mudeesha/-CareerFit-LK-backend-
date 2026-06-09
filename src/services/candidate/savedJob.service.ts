import {
  createSavedJobRecord,
  deleteSavedJobRecord,
  findActiveJobById,
  findCandidateByUserId,
  findSavedJob,
  findSavedJobsByCandidate,
} from "../../repositories/candidate/savedJob.repository";
import { AppError } from "../../utils/appError";

async function getCandidateOrFail(userId: string) {
  const candidate = await findCandidateByUserId(userId);

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return candidate;
}

export async function saveJobService(userId: string, jobId: string) {
  const candidate = await getCandidateOrFail(userId);

  const job = await findActiveJobById(jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Active job not found", 404);
  }

  const existingSavedJob = await findSavedJob(candidate.id, job.id);

  if (existingSavedJob) {
    throw new AppError("JOB_ALREADY_SAVED", "Job is already saved", 409);
  }

  return createSavedJobRecord(candidate.id, job.id);
}

export async function getMySavedJobsService(userId: string) {
  const candidate = await getCandidateOrFail(userId);

  const savedJobs = await findSavedJobsByCandidate(candidate.id);

  return {
    items: savedJobs,
    count: savedJobs.length,
  };
}

export async function removeSavedJobService(userId: string, jobId: string) {
  const candidate = await getCandidateOrFail(userId);

  const savedJob = await findSavedJob(candidate.id, jobId);

  if (!savedJob) {
    throw new AppError("SAVED_JOB_NOT_FOUND", "Saved job not found", 404);
  }

  await deleteSavedJobRecord(candidate.id, jobId);

  return {
    id: savedJob.id,
    jobId: savedJob.jobId,
    removed: true,
  };
}