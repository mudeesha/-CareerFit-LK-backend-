import { CandidateDashboardResponseDto } from "../../dtos/candidate/dashboard.dto";
import {
  countCandidateApplications,
  countCandidateSavedJobs,
  countCandidateShortlistedApplications,
  findCandidateAppliedJobIds,
  findCandidateDashboardProfile,
  findPlatformActiveJobsForSkillInsights,
  findRecentCandidateApplications,
  findRecommendedJobs,
} from "../../repositories/candidate/dashboard.repository";
import { AppError } from "../../utils/appError";

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [];
}

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function calculateMatchScore(
  candidateSkillsValue: unknown,
  jobSkillsValue: unknown
) {
  const candidateSkills = toStringArray(candidateSkillsValue).map(normalizeSkill);
  const jobSkills = toStringArray(jobSkillsValue).map(normalizeSkill);

  if (jobSkills.length === 0) {
    return 0;
  }

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkills.includes(skill)
  );

  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}

function buildSkillGapInsights(
  candidateSkillsValue: unknown,
  jobs: {
    skills: unknown;
  }[]
) {
  const candidateSkills = new Set(
    toStringArray(candidateSkillsValue).map(normalizeSkill)
  );

  const demandCount = new Map<string, number>();

  jobs.forEach((job) => {
    toStringArray(job.skills).forEach((skill) => {
      const trimmedSkill = skill.trim();

      if (!trimmedSkill) {
        return;
      }

      demandCount.set(trimmedSkill, (demandCount.get(trimmedSkill) || 0) + 1);
    });
  });

  return Array.from(demandCount.entries())
    .filter(([skill]) => !candidateSkills.has(normalizeSkill(skill)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({
      skill,
      demand:
        count >= 5
          ? ("High demand" as const)
          : count >= 2
            ? ("Medium demand" as const)
            : ("Low demand" as const),
      match: Math.max(20, 100 - count * 10),
    }));
}

export async function getCandidateDashboardService(
  userId: string
): Promise<CandidateDashboardResponseDto> {
  const candidate = await findCandidateDashboardProfile(userId);

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const appliedJobs = await findCandidateAppliedJobIds(candidate.id);
  const excludedJobIds = appliedJobs.map((application) => application.jobId);

  const [
    totalApplications,
    shortlistedApplications,
    savedJobs,
    recentApplications,
    recommendedJobs,
    platformJobs,
  ] = await Promise.all([
    countCandidateApplications(candidate.id),
    countCandidateShortlistedApplications(candidate.id),
    countCandidateSavedJobs(candidate.id),
    findRecentCandidateApplications(candidate.id),
    findRecommendedJobs(excludedJobIds),
    findPlatformActiveJobsForSkillInsights(),
  ]);

  const latestCvAnalysis = candidate.cvAnalyses[0] || null;

  const recommendedJobsWithMatch = recommendedJobs.map((job) => ({
    ...job,
    matchScore: calculateMatchScore(candidate.skills, job.skills),
  }));

  return {
    profile: {
      id: candidate.id,
      fullName: candidate.fullName,
      email: candidate.user.email,
      currentRole: candidate.currentRole,
      district: candidate.district,
      experienceYears: candidate.experienceYears,
      expectedSalary: candidate.expectedSalary,
      skills: candidate.skills,
      profileCompletion: candidate.profileCompletion,
    },
    stats: {
      profileCompletion: candidate.profileCompletion,
      cvReadiness: latestCvAnalysis?.strengthScore || 0,
      applications: totalApplications,
      shortlisted: shortlistedApplications,
      savedJobs,
    },
    recommendedJobs: recommendedJobsWithMatch,
    recentApplications,
    skillGapInsights: buildSkillGapInsights(candidate.skills, platformJobs),
    latestCvAnalysis,
  };
}