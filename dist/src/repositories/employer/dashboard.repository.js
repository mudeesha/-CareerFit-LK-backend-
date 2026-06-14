"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyStatus = void 0;
exports.findEmployerDashboardProfile = findEmployerDashboardProfile;
exports.countEmployerActiveJobs = countEmployerActiveJobs;
exports.countEmployerPendingReviewJobs = countEmployerPendingReviewJobs;
exports.countEmployerApplications = countEmployerApplications;
exports.countEmployerShortlistedApplications = countEmployerShortlistedApplications;
exports.findEmployerApplicationsForTrend = findEmployerApplicationsForTrend;
exports.findEmployerRecentApplicants = findEmployerRecentApplicants;
exports.findEmployerActiveJobs = findEmployerActiveJobs;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "CompanyStatus", { enumerable: true, get: function () { return client_1.CompanyStatus; } });
const prisma_1 = require("../../lib/prisma");
async function findEmployerDashboardProfile(userId) {
    return prisma_1.prisma.employerProfile.findUnique({
        where: {
            userId,
        },
        include: {
            company: true,
        },
    });
}
async function countEmployerActiveJobs(companyId) {
    return prisma_1.prisma.job.count({
        where: {
            companyId,
            status: client_1.JobStatus.ACTIVE,
        },
    });
}
async function countEmployerPendingReviewJobs(companyId) {
    return prisma_1.prisma.job.count({
        where: {
            companyId,
            status: client_1.JobStatus.PENDING_APPROVAL,
        },
    });
}
async function countEmployerApplications(companyId) {
    return prisma_1.prisma.application.count({
        where: {
            job: {
                companyId,
            },
        },
    });
}
async function countEmployerShortlistedApplications(companyId) {
    return prisma_1.prisma.application.count({
        where: {
            status: client_1.ApplicationStatus.SHORTLISTED,
            job: {
                companyId,
            },
        },
    });
}
async function findEmployerApplicationsForTrend(companyId) {
    return prisma_1.prisma.application.findMany({
        where: {
            job: {
                companyId,
            },
        },
        select: {
            appliedAt: true,
        },
        orderBy: {
            appliedAt: "asc",
        },
    });
}
async function findEmployerRecentApplicants(companyId) {
    return prisma_1.prisma.application.findMany({
        where: {
            job: {
                companyId,
            },
        },
        include: {
            candidate: true,
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
        },
        orderBy: {
            appliedAt: "desc",
        },
        take: 5,
    });
}
async function findEmployerActiveJobs(companyId) {
    return prisma_1.prisma.job.findMany({
        where: {
            companyId,
            status: client_1.JobStatus.ACTIVE,
        },
        include: {
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
}
//# sourceMappingURL=dashboard.repository.js.map