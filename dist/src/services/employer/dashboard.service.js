"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerDashboardService = getEmployerDashboardService;
const dashboard_repository_1 = require("../../repositories/employer/dashboard.repository");
const appError_1 = require("../../utils/appError");
function formatRelativeTime(date) {
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
function formatDayName(date) {
    return date.toLocaleString("en-US", {
        weekday: "short",
    });
}
function buildApplicationsTrend(applications) {
    const now = new Date();
    const lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
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
async function getEmployerCompanyOrFail(userId) {
    const employer = await (0, dashboard_repository_1.findEmployerDashboardProfile)(userId);
    if (!employer) {
        throw new appError_1.AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
    }
    if (!employer.companyId || !employer.company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Employer is not linked to a company", 400);
    }
    if (employer.company.status !== dashboard_repository_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_NOT_APPROVED", "Company must be approved before viewing dashboard", 403);
    }
    return employer.company;
}
async function getEmployerDashboardService(userId) {
    const company = await getEmployerCompanyOrFail(userId);
    const [activeJobsCount, totalApplicants, shortlisted, pendingReviews, applicationsForTrend, recentApplications, activeJobs,] = await Promise.all([
        (0, dashboard_repository_1.countEmployerActiveJobs)(company.id),
        (0, dashboard_repository_1.countEmployerApplications)(company.id),
        (0, dashboard_repository_1.countEmployerShortlistedApplications)(company.id),
        (0, dashboard_repository_1.countEmployerPendingReviewJobs)(company.id),
        (0, dashboard_repository_1.findEmployerApplicationsForTrend)(company.id),
        (0, dashboard_repository_1.findEmployerRecentApplicants)(company.id),
        (0, dashboard_repository_1.findEmployerActiveJobs)(company.id),
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
//# sourceMappingURL=dashboard.service.js.map