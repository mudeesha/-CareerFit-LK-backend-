import { UserRole } from "@prisma/client";
import { GetJobsQueryDto } from "../../dtos/public/job.dto";
import {
  findCandidateLatestCvSkills,
  findJobById,
  findJobs,
} from "../../repositories/public/job.repository";
import { AppError } from "../../utils/appError";

type AuthUser =
  | {
      id: string;
      email: string;
      role: UserRole;
    }
  | undefined;

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function getJobRequiredSkills(job: {
  skills: unknown;
  preferredSkills?: unknown;
}) {
  const requiredSkills = [
    ...toStringArray(job.skills),
    ...toStringArray(job.preferredSkills),
  ];

  return Array.from(new Set(requiredSkills.map((skill) => skill.trim()))).filter(
    Boolean
  );
}

function calculateJobMatchScore(job: {
  skills: unknown;
  preferredSkills?: unknown;
}, candidateSkills: string[]) {
  const jobSkills = getJobRequiredSkills(job);

  if (jobSkills.length === 0 || candidateSkills.length === 0) {
    return 0;
  }

  const candidateSkillSet = new Set(candidateSkills.map(normalizeSkill));

  const matchedCount = jobSkills.filter((skill) =>
    candidateSkillSet.has(normalizeSkill(skill))
  ).length;

  return Math.round((matchedCount / jobSkills.length) * 100);
}

async function attachMatchScores<T extends { skills: unknown; preferredSkills?: unknown }>(
  jobs: T[],
  user?: AuthUser
) {
  if (!user || user.role !== "CANDIDATE") {
    return jobs;
  }

  const candidateSkills = await findCandidateLatestCvSkills(user.id);

  const jobsWithScore = jobs.map((job) => ({
    ...job,
    matchScore: calculateJobMatchScore(job, candidateSkills),
  }));

  return jobsWithScore.sort((a, b) => b.matchScore - a.matchScore);
}

export async function getJobsService(filters: GetJobsQueryDto, user?: AuthUser) {
  const jobs = await findJobs(filters);
  const items = await attachMatchScores(jobs, user);

  return {
    items,
    count: items.length,
  };
}

export async function getJobByIdService(id: string, user?: AuthUser) {
  const job = await findJobById(id);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  const [jobWithScore] = await attachMatchScores([job], user);

  return jobWithScore;
}