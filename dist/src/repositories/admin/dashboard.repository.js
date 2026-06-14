"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countCandidates = countCandidates;
exports.countEmployers = countEmployers;
exports.countActiveJobs = countActiveJobs;
exports.countPendingCompanies = countPendingCompanies;
exports.countPendingJobs = countPendingJobs;
exports.findApplicationsForTrend = findApplicationsForTrend;
exports.findCvMissingSkills = findCvMissingSkills;
exports.findRecentPendingJobs = findRecentPendingJobs;
exports.findRecentPendingCompanies = findRecentPendingCompanies;
exports.findRecentApplications = findRecentApplications;
exports.findRecentAdminActions = findRecentAdminActions;
exports.mapAdminActionTypeToActivityType = mapAdminActionTypeToActivityType;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function countCandidates() {
    return prisma_1.prisma.user.count({
        where: {
            role: client_1.UserRole.CANDIDATE,
        },
    });
}
async function countEmployers() {
    return prisma_1.prisma.user.count({
        where: {
            role: client_1.UserRole.EMPLOYER,
        },
    });
}
async function countActiveJobs() {
    return prisma_1.prisma.job.count({
        where: {
            status: client_1.JobStatus.ACTIVE,
        },
    });
}
async function countPendingCompanies() {
    return prisma_1.prisma.company.count({
        where: {
            status: client_1.CompanyStatus.PENDING,
        },
    });
}
async function countPendingJobs() {
    return prisma_1.prisma.job.count({
        where: {
            status: client_1.JobStatus.PENDING_APPROVAL,
        },
    });
}
async function findApplicationsForTrend() {
    return prisma_1.prisma.application.findMany({
        select: {
            appliedAt: true,
        },
        orderBy: {
            appliedAt: "asc",
        },
    });
}
async function findCvMissingSkills() {
    return prisma_1.prisma.cvAnalysis.findMany({
        select: {
            missingSkills: true,
        },
    });
}
async function findRecentPendingJobs() {
    return prisma_1.prisma.job.findMany({
        where: {
            status: client_1.JobStatus.PENDING_APPROVAL,
        },
        include: {
            company: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 3,
    });
}
async function findRecentPendingCompanies() {
    return prisma_1.prisma.company.findMany({
        where: {
            status: client_1.CompanyStatus.PENDING,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 3,
    });
}
async function findRecentApplications() {
    return prisma_1.prisma.application.findMany({
        include: {
            candidate: true,
            job: {
                include: {
                    company: true,
                },
            },
        },
        orderBy: {
            appliedAt: "desc",
        },
        take: 3,
    });
}
async function findRecentAdminActions() {
    return prisma_1.prisma.adminAction.findMany({
        include: {
            company: true,
            job: {
                include: {
                    company: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
}
function mapAdminActionTypeToActivityType(action) {
    if (action === client_1.AdminActionType.APPROVED) {
        return "success";
    }
    if (action === client_1.AdminActionType.REJECTED ||
        action === client_1.AdminActionType.SUSPENDED ||
        action === client_1.AdminActionType.CLOSED) {
        return "error";
    }
    return "info";
}
//# sourceMappingURL=dashboard.repository.js.map