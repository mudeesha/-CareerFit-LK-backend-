import {
  findCandidateForMatchByUserId,
  findJobForMatch,
} from "../../repositories/candidate/match.repository";
import { AppError } from "../../utils/appError";
import { JobMatchResponseDto } from "../../dtos/candidate/match.dto";

export async function getJobMatchService(
  userId: string,
  jobId: string
): Promise<JobMatchResponseDto> {
  const candidate = await findCandidateForMatchByUserId(userId);

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const job = await findJobForMatch(jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  const latestCvAnalysis = candidate.cvAnalyses[0] || null;
  const candidateSkills = toStringArray(latestCvAnalysis?.extractedSkills);
  const candidateLanguages = toStringArray(latestCvAnalysis?.languages);
  const candidateExperienceYears = latestCvAnalysis?.experienceYears ?? 0;

  const jobSkills = getJobRequiredSkills(job);

  const candidateSkillSet = new Set(candidateSkills.map(normalizeSkill));

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkillSet.has(normalizeSkill(skill))
  );

  const missingSkills = jobSkills.filter(
    (skill) => !candidateSkillSet.has(normalizeSkill(skill))
  );

  const skillsScore =
    jobSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobSkills.length) * 100);

  const experienceScore = calculateExperienceScore(
    candidateExperienceYears,
    job.experienceLevel
  );

  const locationScore = calculateLocationScore(
    candidate.preferredLocations,
    job.location,
    job.workMode
  );

  const salaryScore = calculateSalaryScore(
    candidate.expectedSalary,
    job.salaryMin,
    job.salaryMax
  );

  const languageScore = calculateLanguageScore(candidateLanguages);

  const overallScore = Math.round(
    skillsScore * 0.6 +
      experienceScore * 0.2 +
      locationScore * 0.1 +
      salaryScore * 0.05 +
      languageScore * 0.05
  );

  return {
    jobId: job.id,
    candidateId: candidate.id,
    overallScore,
    matchLabel: getMatchLabel(overallScore),
    applyReadiness: getApplyReadiness(overallScore),
    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      location: locationScore,
      salary: salaryScore,
      language: languageScore,
    },
    matchedSkills,
    missingSkills,
    suggestions: buildSuggestions(missingSkills),
    learningPath: buildLearningPath(missingSkills),
  };
}

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

function calculateExperienceScore(
  candidateYears: number,
  experienceLevel: string
): number {
  const requiredYearsMap: Record<string, number> = {
    ENTRY_LEVEL: 0,
    ONE_TO_TWO_YEARS: 1,
    THREE_TO_FIVE_YEARS: 3,
    FIVE_PLUS_YEARS: 5,
  };

  const requiredYears = requiredYearsMap[experienceLevel] ?? 0;

  if (requiredYears === 0) {
    return 100;
  }

  if (candidateYears >= requiredYears) {
    return 100;
  }

  return Math.round((candidateYears / requiredYears) * 100);
}

function calculateLocationScore(
  preferredLocationsValue: unknown,
  jobLocation: string,
  workMode: string
): number {
  if (workMode === "REMOTE") {
    return 100;
  }

  const preferredLocations = toStringArray(preferredLocationsValue).map((loc) =>
    loc.toLowerCase()
  );

  if (preferredLocations.includes(jobLocation.toLowerCase())) {
    return 100;
  }

  return 60;
}

function calculateSalaryScore(
  expectedSalary: number | null,
  salaryMin: number,
  salaryMax: number
): number {
  if (!expectedSalary) {
    return 70;
  }

  if (expectedSalary >= salaryMin && expectedSalary <= salaryMax) {
    return 100;
  }

  if (expectedSalary < salaryMin) {
    return 90;
  }

  const difference = expectedSalary - salaryMax;
  const percentageOver = difference / salaryMax;

  if (percentageOver <= 0.1) {
    return 80;
  }

  if (percentageOver <= 0.25) {
    return 60;
  }

  return 40;
}

function calculateLanguageScore(languagesValue: unknown): number {
  const languages = toStringArray(languagesValue).map((language) =>
    language.toLowerCase()
  );

  if (languages.includes("english") && languages.includes("sinhala")) {
    return 100;
  }

  if (languages.includes("english")) {
    return 80;
  }

  return 60;
}

function getMatchLabel(score: number) {
  if (score >= 80) {
    return "Strong Match";
  }

  if (score >= 60) {
    return "Good Match";
  }

  return "Low Match";
}

function getApplyReadiness(score: number) {
  if (score >= 80) {
    return "READY_TO_APPLY";
  }

  if (score >= 60) {
    return "IMPROVE_CV_FIRST";
  }

  return "NOT_RECOMMENDED_YET";
}

function buildSuggestions(missingSkills: string[]): string[] {
  if (missingSkills.length === 0) {
    return ["Your CV matches the main job requirements well."];
  }

  return missingSkills.map((skill) => `Improve your ${skill} skills.`);
}

function buildLearningPath(missingSkills: string[]): string[] {
  if (missingSkills.length === 0) {
    return ["Prepare for interview questions", "Review your project examples"];
  }

  return missingSkills.map((skill) => `${skill} fundamentals`);
}