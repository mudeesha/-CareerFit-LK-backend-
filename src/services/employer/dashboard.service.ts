import { EmployerDashboardResponseDto } from "../../dtos/employer/dashboard.dto";
import {
  CompanyStatus,
  countEmployerActiveJobs,
  countEmployerApplications,
  countEmployerPendingReviewJobs,
  countEmployerShortlistedApplications,
  findEmployerActiveJobs,
  findEmployerApplicationsForTrend,
  findEmployerDashboardProfile,
  findEmployerRecentApplicants,
} from "../../repositories/employer/dashboard.repository";
import { AppError } from "../../utils/appError";

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);

  return `${diffMonths}mo ago`;
}

function formatDayName(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "short",
  });
}

function buildApplicationsTrend(applications: { appliedAt: Date }[]) {
  const now = new Date();

  const lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (6 - index)
    );

    return {
      key: date.toISOString().slice(0, 10),
      name: formatDayName(date),
      applicants: 0,
    };
  });

  const dayMap = new Map(lastSevenDays.map((item) => [item.key, item]));

  applications.forEach((application) => {
    const date = new Date(application.appliedAt);
    const key = date.toISOString().slice(0, 10);

    const item = dayMap.get(key);

    if (item) {
      item.applicants += 1;
    }
  });

  return lastSevenDays.map(({ name, applicants }) => ({
    name,
    applicants,
  }));
}

async function getEmployerCompanyOrFail(userId: string) {
  const employer = await findEmployerDashboardProfile(userId);

  if (!employer) {
    throw new AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
  }

  if (!employer.companyId || !employer.company) {
    throw new AppError(
      "COMPANY_NOT_FOUND",
      "Employer is not linked to a company",
      400
    );
  }

  if (employer.company.status !== CompanyStatus.APPROVED) {
    throw new AppError(
      "COMPANY_NOT_APPROVED",
      "Company must be approved before viewing dashboard",
      403
    );
  }

  return employer.company;
}

export async function getEmployerDashboardService(
  userId: string
): Promise<EmployerDashboardResponseDto> {
  const company = await getEmployerCompanyOrFail(userId);

  const [
    activeJobsCount,
    totalApplicants,
    shortlisted,
    pendingReviews,
    applicationsForTrend,
    recentApplications,
    activeJobs,
  ] = await Promise.all([
    countEmployerActiveJobs(company.id),
    countEmployerApplications(company.id),
    countEmployerShortlistedApplications(company.id),
    countEmployerPendingReviewJobs(company.id),
    findEmployerApplicationsForTrend(company.id),
    findEmployerRecentApplicants(company.id),
    findEmployerActiveJobs(company.id),
  ]);

  return {
    stats: {
      activeJobs: activeJobsCount,
      totalApplicants,
      shortlisted,
      pendingReviews,
    },
    applicationsTrend: buildApplicationsTrend(applicationsForTrend),
    recentApplicants: recentApplications.map((application) => ({
      id: application.id,
      candidateName: application.candidate.fullName,
      role: application.job.title,
      score: application.matchScore || 0,
      time: formatRelativeTime(application.appliedAt),
    })),
    activeJobs,
  };
}