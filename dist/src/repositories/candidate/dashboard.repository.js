"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateDashboardProfile = findCandidateDashboardProfile;
exports.countCandidateApplications = countCandidateApplications;
exports.countCandidateShortlistedApplications = countCandidateShortlistedApplications;
exports.countCandidateSavedJobs = countCandidateSavedJobs;
exports.findRecentCandidateApplications = findRecentCandidateApplications;
exports.findCandidateAppliedJobIds = findCandidateAppliedJobIds;
exports.findRecommendedJobs = findRecommendedJobs;
exports.findPlatformActiveJobsForSkillInsights = findPlatformActiveJobsForSkillInsights;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findCandidateDashboardProfile(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: {
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
            cvAnalyses: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });
}
async function countCandidateApplications(candidateId) {
    return prisma_1.prisma.application.count({
        where: {
            candidateId,
        },
    });
}
async function countCandidateShortlistedApplications(candidateId) {
    return prisma_1.prisma.application.count({
        where: {
            candidateId,
            status: client_1.ApplicationStatus.SHORTLISTED,
        },
    });
}
async function countCandidateSavedJobs(candidateId) {
    return prisma_1.prisma.savedJob.count({
        where: {
            candidateId,
        },
    });
}
async function findRecentCandidateApplications(candidateId) {
    return prisma_1.prisma.application.findMany({
        where: {
            candidateId,
        },
        include: {
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
        take: 3,
    });
}
async function findCandidateAppliedJobIds(candidateId) {
    return prisma_1.prisma.application.findMany({
        where: {
            candidateId,
            status: {
                not: client_1.ApplicationStatus.WITHDRAWN,
            },
        },
        select: {
            jobId: true,
        },
    });
}
async function findRecommendedJobs(excludedJobIds) {
    return prisma_1.prisma.job.findMany({
        where: {
            status: client_1.JobStatus.ACTIVE,
            id: excludedJobIds.length
                ? {
                    notIn: excludedJobIds,
                }
                : undefined,
        },
        include: {
            company: true,
            category: true,
        },
        orderBy: [
            {
                isFeatured: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
        take: 6,
    });
}
async function findPlatformActiveJobsForSkillInsights() {
    return prisma_1.prisma.job.findMany({
        where: {
            status: client_1.JobStatus.ACTIVE,
        },
        select: {
            skills: true,
        },
    });
}
//# sourceMappingURL=dashboard.repository.js.map