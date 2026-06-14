"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPendingJobs = findPendingJobs;
exports.findAdminJobById = findAdminJobById;
exports.updateJobStatusRecord = updateJobStatusRecord;
exports.updateJobFeaturedRecord = updateJobFeaturedRecord;
exports.createJobAdminActionRecord = createJobAdminActionRecord;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findPendingJobs() {
    return prisma_1.prisma.job.findMany({
        where: {
            status: client_1.JobStatus.PENDING_APPROVAL,
        },
        include: {
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function findAdminJobById(jobId) {
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
async function updateJobStatusRecord(jobId, status) {
    return prisma_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            status,
            postedDate: status === client_1.JobStatus.ACTIVE ? "Just now" : undefined,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function updateJobFeaturedRecord(jobId, isFeatured) {
    return prisma_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            isFeatured,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function createJobAdminActionRecord(data) {
    return prisma_1.prisma.adminAction.create({
        data: {
            adminUserId: data.adminUserId,
            entityType: client_1.AdminEntityType.JOB,
            entityId: data.jobId,
            action: data.action,
            reason: data.reason,
            jobId: data.jobId,
        },
    });
}
//# sourceMappingURL=job.repository.js.map