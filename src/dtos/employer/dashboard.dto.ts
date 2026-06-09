export interface EmployerDashboardStatsDto {
  activeJobs: number;
  totalApplicants: number;
  shortlisted: number;
  pendingReviews: number;
}

export interface EmployerApplicationsTrendDto {
  name: string;
  applicants: number;
}

export interface EmployerRecentApplicantDto {
  id: string;
  candidateName: string;
  role: string;
  score: number;
  time: string;
}

export interface EmployerDashboardResponseDto {
  stats: EmployerDashboardStatsDto;
  applicationsTrend: EmployerApplicationsTrendDto[];
  recentApplicants: EmployerRecentApplicantDto[];
  activeJobs: unknown[];
}