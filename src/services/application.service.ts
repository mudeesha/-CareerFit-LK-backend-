import { CreateApplicationDto } from "../dtos/application.dto";
import {
  createApplicationRecord,
  findApplicationByCandidateAndJob,
  findApplicationById,
  findDemoCandidate,
  findJobForApplication,
  findMyApplications,
  incrementJobApplicantCount,
  withdrawApplicationRecord,
} from "../repositories/application.repository";
import { AppError } from "../utils/appError";

export async function createApplicationService(data: CreateApplicationDto) {
  const candidate = await findDemoCandidate();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const job = await findJobForApplication(data.jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  if (job.status !== "ACTIVE") {
    throw new AppError("JOB_NOT_ACTIVE", "This job is not active", 400);
  }

  const existingApplication = await findApplicationByCandidateAndJob(
    candidate.id,
    data.jobId
  );

  if (existingApplication && existingApplication.status !== "WITHDRAWN") {
    throw new AppError(
      "ALREADY_APPLIED",
      "You have already applied for this job",
      409
    );
  }

  const matchScore = calculateSimpleMatchScore(candidate.skills, job.skills);

  const application = await createApplicationRecord({
    candidateId: candidate.id,
    jobId: job.id,
    coverLetter: data.coverLetter,
    matchScore,
  });

  await incrementJobApplicantCount(job.id);

  return application;
}

export async function getMyApplicationsService() {
  const candidate = await findDemoCandidate();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return findMyApplications(candidate.id);
}

export async function withdrawApplicationService(applicationId: string) {
  const candidate = await findDemoCandidate();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const application = await findApplicationById(applicationId);

  if (!application) {
    throw new AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
  }

  if (application.candidateId !== candidate.id) {
    throw new AppError("FORBIDDEN", "You cannot withdraw this application", 403);
  }

  if (application.status === "WITHDRAWN") {
    throw new AppError(
      "APPLICATION_ALREADY_WITHDRAWN",
      "Application is already withdrawn",
      400
    );
  }

  return withdrawApplicationRecord(applicationId);
}

function calculateSimpleMatchScore(
  candidateSkillsValue: unknown,
  jobSkillsValue: unknown
) {
  const candidateSkills = Array.isArray(candidateSkillsValue)
    ? candidateSkillsValue.map((skill) => String(skill).toLowerCase())
    : [];

  const jobSkills = Array.isArray(jobSkillsValue)
    ? jobSkillsValue.map((skill) => String(skill).toLowerCase())
    : [];

  if (jobSkills.length === 0) {
    return 0;
  }

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkills.includes(skill)
  );

  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}