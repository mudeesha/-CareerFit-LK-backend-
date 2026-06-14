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
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function getJobRequiredSkills(job: {
  skills: unknown;
  preferredSkills?: unknown;
}) {
  const skills = [
    ...toStringArray(job.skills),
    ...toStringArray(job.preferredSkills),
  ];

  return Array.from(new Set(skills.map((skill) => skill.trim()))).filter(
    Boolean
  );
}

function calculateMatchScore(
  candidateSkillsValue: unknown,
  job: {
    skills: unknown;
    preferredSkills?: unknown;
  }
) {
  const candidateSkills = toStringArray(candidateSkillsValue);

  const jobSkills = getJobRequiredSkills(job);

  if (candidateSkills.length === 0 || jobSkills.length === 0) {
    return 0;
  }

  const candidateSkillSet = new Set(candidateSkills.map(normalizeSkill));

  const matchedCount = jobSkills.filter((skill) =>
    candidateSkillSet.has(normalizeSkill(skill))
  ).length;

  return Math.round((matchedCount / jobSkills.length) * 100);
}

function buildSkillGapInsights(
  candidateSkillsValue: unknown,
  jobs: {
    skills: unknown;
    preferredSkills?: unknown;
  }[]
) {
  const candidateSkills = new Set(
    toStringArray(candidateSkillsValue).map(normalizeSkill)
  );

  const missingSkillCounts = new Map<string, number>();

  for (const job of jobs) {
    const jobSkills = getJobRequiredSkills(job);

    for (const skill of jobSkills) {
      if (!candidateSkills.has(normalizeSkill(skill))) {
        missingSkillCounts.set(skill, (missingSkillCounts.get(skill) || 0) + 1);
      }
    }
  }

  return Array.from(missingSkillCounts.entries())
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
  const cvSkills = latestCvAnalysis?.extractedSkills ?? [];

  const recommendedJobsWithMatch = recommendedJobs
    .map((job) => ({
      ...job,
      matchScore: calculateMatchScore(cvSkills, job),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

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
      cvReadiness: latestCvAnalysis ? 100 : 0,
      applications: totalApplications,
      shortlisted: shortlistedApplications,
      savedJobs,
    },
    recommendedJobs: recommendedJobsWithMatch,
    recentApplications,
    skillGapInsights: buildSkillGapInsights(cvSkills, recommendedJobsWithMatch),
    latestCvAnalysis,
  };
}