export interface CandidateDashboardProfileDto {
  id: string;
  fullName: string;
  email: string;
  currentRole: string | null;
  district: string | null;
  experienceYears: number;
  expectedSalary: number | null;
  skills: unknown;
  profileCompletion: number;
}

export interface CandidateDashboardStatsDto {
  profileCompletion: number;
  cvReadiness: number;
  applications: number;
  shortlisted: number;
  savedJobs: number;
}

export interface CandidateSkillGapInsightDto {
  skill: string;
  demand: "High demand" | "Medium demand" | "Low demand";
  match: number;
}

export interface CandidateDashboardResponseDto {
  profile: CandidateDashboardProfileDto;
  stats: CandidateDashboardStatsDto;
  recommendedJobs: unknown[];
  recentApplications: unknown[];
  skillGapInsights: CandidateSkillGapInsightDto[];
  latestCvAnalysis: unknown | null;
}