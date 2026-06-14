"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateByUserId = findCandidateByUserId;
exports.findJobForApplication = findJobForApplication;
exports.findActiveApplicationByCandidateAndJob = findActiveApplicationByCandidateAndJob;
exports.createApplicationRecord = createApplicationRecord;
exports.findMyApplications = findMyApplications;
exports.findApplicationById = findApplicationById;
exports.withdrawApplicationRecord = withdrawApplicationRecord;
exports.incrementJobApplicantCount = incrementJobApplicantCount;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findCandidateByUserId(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: {
            userId,
        },
    });
}
async function findJobForApplication(jobId) {
    return prisma_1.prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function findActiveApplicationByCandidateAndJob(candidateId, jobId) {
    return prisma_1.prisma.application.findFirst({
        where: {
            candidateId,
            jobId,
            status: {
                not: client_1.ApplicationStatus.WITHDRAWN,
            },
        },
    });
}
async function createApplicationRecord(data) {
    return prisma_1.prisma.application.create({
        data: {
            candidateId: data.candidateId,
            jobId: data.jobId,
            coverLetter: data.coverLetter,
            matchScore: data.matchScore,
            status: client_1.ApplicationStatus.APPLIED,
        },
        include: {
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
            candidate: true,
        },
    });
}
async function findMyApplications(candidateId) {
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
    });
}
async function findApplicationById(applicationId) {
    return prisma_1.prisma.application.findUnique({
        where: {
            id: applicationId,
        },
    });
}
async function withdrawApplicationRecord(applicationId) {
    return prisma_1.prisma.application.update({
        where: {
            id: applicationId,
        },
        data: {
            status: client_1.ApplicationStatus.WITHDRAWN,
            withdrawnAt: new Date(),
        },
        include: {
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
        },
    });
}
async function incrementJobApplicantCount(jobId) {
    return prisma_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            applicantCount: {
                increment: 1,
            },
        },
    });
}
//# sourceMappingURL=application.repository.js.map