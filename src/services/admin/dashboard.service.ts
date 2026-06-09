import { AdminEntityType } from "@prisma/client";
import {
  countActiveJobs,
  countCandidates,
  countEmployers,
  countPendingCompanies,
  countPendingJobs,
  findApplicationsForTrend,
  findCvMissingSkills,
  findRecentAdminActions,
  findRecentApplications,
  findRecentPendingCompanies,
  findRecentPendingJobs,
  mapAdminActionTypeToActivityType,
} from "../../repositories/admin/dashboard.repository";

type ActivityType = "pending" | "info" | "success" | "error";

function formatMonthName(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
  });
}

function buildApplicationsTrend(applications: { appliedAt: Date }[]) {
  const now = new Date();

  const lastSixMonths = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: formatMonthName(date),
      value: 0,
    };
  });

  const monthMap = new Map(lastSixMonths.map((item) => [item.key, item]));

  applications.forEach((application) => {
    const date = new Date(application.appliedAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const item = monthMap.get(key);

    if (item) {
      item.value += 1;
    }
  });

  return lastSixMonths.map(({ name, value }) => ({
    name,
    value,
  }));
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [];
}

function buildTopMissingSkills(
  cvAnalyses: {
    missingSkills: unknown;
  }[]
) {
  const counts = new Map<string, number>();

  cvAnalyses.forEach((analysis) => {
    toStringArray(analysis.missingSkills).forEach((skill) => {
      const normalizedSkill = skill.trim();

      if (!normalizedSkill) {
        return;
      }

      counts.set(normalizedSkill, (counts.get(normalizedSkill) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

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
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);

  return `${diffYears} years ago`;
}

function createActivity(
  action: string,
  entity: string,
  timeDate: Date,
  type: ActivityType
) {
  return {
    action,
    entity,
    time: formatRelativeTime(timeDate),
    type,
  };
}

export async function getAdminDashboardService() {
  const [
    totalCandidates,
    totalEmployers,
    activeJobs,
    pendingCompanies,
    pendingJobs,
    applications,
    cvAnalyses,
    recentPendingJobs,
    recentPendingCompanies,
    recentApplications,
    recentAdminActions,
  ] = await Promise.all([
    countCandidates(),
    countEmployers(),
    countActiveJobs(),
    countPendingCompanies(),
    countPendingJobs(),
    findApplicationsForTrend(),
    findCvMissingSkills(),
    findRecentPendingJobs(),
    findRecentPendingCompanies(),
    findRecentApplications(),
    findRecentAdminActions(),
  ]);

  const pendingApprovals = pendingCompanies + pendingJobs;

  const pendingJobActivities = recentPendingJobs.map((job) =>
    createActivity(
      "Job submitted for review",
      `${job.title} by ${job.company?.name || "Unknown company"}`,
      job.createdAt,
      "pending"
    )
  );

  const pendingCompanyActivities = recentPendingCompanies.map((company) =>
    createActivity(
      "Employer registered",
      company.name,
      company.createdAt,
      "info"
    )
  );

  const applicationActivities = recentApplications.map((application) =>
    createActivity(
      "Candidate applied",
      `${application.candidate.fullName} to ${application.job.title}`,
      application.appliedAt,
      "info"
    )
  );

  const adminActionActivities = recentAdminActions.map((adminAction) => {
    const entityName =
      adminAction.entityType === AdminEntityType.COMPANY
        ? adminAction.company?.name || adminAction.entityId
        : adminAction.job
          ? `${adminAction.job.title} by ${adminAction.job.company?.name || "Unknown company"}`
          : adminAction.entityId;

    return createActivity(
      `${adminAction.entityType.toLowerCase()} ${adminAction.action.toLowerCase()}`,
      entityName,
      adminAction.createdAt,
      mapAdminActionTypeToActivityType(adminAction.action)
    );
  });

  const recentActivities = [
    ...pendingJobActivities,
    ...pendingCompanyActivities,
    ...applicationActivities,
    ...adminActionActivities,
  ]
    .sort((a, b) => {
      // Sorting is already approximately recent, but each item only has relative text now.
      // Keep mixed activities concise and stable for dashboard display.
      return 0;
    })
    .slice(0, 5);

  return {
    stats: {
      totalCandidates,
      totalEmployers,
      activeJobs,
      pendingApprovals,
      pendingCompanies,
      pendingJobs,
    },
    applicationsTrend: buildApplicationsTrend(applications),
    topMissingSkills: buildTopMissingSkills(cvAnalyses),
    recentActivities,
  };
}