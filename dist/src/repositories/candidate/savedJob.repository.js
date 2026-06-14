"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateByUserId = findCandidateByUserId;
exports.findActiveJobById = findActiveJobById;
exports.findSavedJob = findSavedJob;
exports.createSavedJobRecord = createSavedJobRecord;
exports.findSavedJobsByCandidate = findSavedJobsByCandidate;
exports.deleteSavedJobRecord = deleteSavedJobRecord;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findCandidateByUserId(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: {
            userId,
        },
    });
}
async function findActiveJobById(jobId) {
    return prisma_1.prisma.job.findFirst({
        where: {
            id: jobId,
            status: client_1.JobStatus.ACTIVE,
        },
    });
}
async function findSavedJob(candidateId, jobId) {
    return prisma_1.prisma.savedJob.findUnique({
        where: {
            candidateId_jobId: {
                candidateId,
                jobId,
            },
        },
    });
}
async function createSavedJobRecord(candidateId, jobId) {
    return prisma_1.prisma.savedJob.create({
        data: {
            candidateId,
            jobId,
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
async function findSavedJobsByCandidate(candidateId) {
    return prisma_1.prisma.savedJob.findMany({
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
            createdAt: "desc",
        },
    });
}
async function deleteSavedJobRecord(candidateId, jobId) {
    return prisma_1.prisma.savedJob.delete({
        where: {
            candidateId_jobId: {
                candidateId,
                jobId,
            },
        },
    });
}
//# sourceMappingURL=savedJob.repository.js.map