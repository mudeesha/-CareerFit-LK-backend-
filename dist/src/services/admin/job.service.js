"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingJobsService = getPendingJobsService;
exports.approveJobService = approveJobService;
exports.rejectJobService = rejectJobService;
exports.featureJobService = featureJobService;
exports.closeJobService = closeJobService;
const client_1 = require("@prisma/client");
const job_repository_1 = require("../../repositories/admin/job.repository");
const appError_1 = require("../../utils/appError");
async function getJobOrFail(jobId) {
    const job = await (0, job_repository_1.findAdminJobById)(jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    return job;
}
async function getPendingJobsService() {
    const jobs = await (0, job_repository_1.findPendingJobs)();
    return {
        items: jobs,
        count: jobs.length,
    };
}
async function approveJobService(adminUserId, jobId) {
    const job = await getJobOrFail(jobId);
    if (job.status === client_1.JobStatus.ACTIVE) {
        throw new appError_1.AppError("JOB_ALREADY_ACTIVE", "Job is already active", 400);
    }
    if (job.status === client_1.JobStatus.CLOSED) {
        throw new appError_1.AppError("JOB_CLOSED", "Closed job cannot be approved", 400);
    }
    if (job.status === client_1.JobStatus.REJECTED) {
        throw new appError_1.AppError("JOB_REJECTED", "Rejected job cannot be approved directly", 400);
    }
    const updatedJob = await (0, job_repository_1.updateJobStatusRecord)(job.id, client_1.JobStatus.ACTIVE);
    await (0, job_repository_1.createJobAdminActionRecord)({
        adminUserId,
        jobId: job.id,
        action: client_1.AdminActionType.APPROVED,
    });
    return updatedJob;
}
async function rejectJobService(adminUserId, jobId, reason) {
    const job = await getJobOrFail(jobId);
    if (job.status === client_1.JobStatus.REJECTED) {
        throw new appError_1.AppError("JOB_ALREADY_REJECTED", "Job is already rejected", 400);
    }
    if (job.status === client_1.JobStatus.ACTIVE) {
        throw new appError_1.AppError("JOB_ALREADY_ACTIVE", "Active job cannot be rejected. Close it instead.", 400);
    }
    if (job.status === client_1.JobStatus.CLOSED) {
        throw new appError_1.AppError("JOB_CLOSED", "Closed job cannot be rejected", 400);
    }
    const updatedJob = await (0, job_repository_1.updateJobStatusRecord)(job.id, client_1.JobStatus.REJECTED);
    await (0, job_repository_1.createJobAdminActionRecord)({
        adminUserId,
        jobId: job.id,
        action: client_1.AdminActionType.REJECTED,
        reason,
    });
    return updatedJob;
}
async function featureJobService(adminUserId, jobId, requestedFeatured) {
    const job = await getJobOrFail(jobId);
    if (job.status !== client_1.JobStatus.ACTIVE) {
        throw new appError_1.AppError("JOB_NOT_ACTIVE", "Only active jobs can be featured", 400);
    }
    const nextFeatured = requestedFeatured === undefined ? !job.isFeatured : requestedFeatured;
    const updatedJob = await (0, job_repository_1.updateJobFeaturedRecord)(job.id, nextFeatured);
    if (nextFeatured) {
        await (0, job_repository_1.createJobAdminActionRecord)({
            adminUserId,
            jobId: job.id,
            action: client_1.AdminActionType.FEATURED,
        });
    }
    return updatedJob;
}
async function closeJobService(adminUserId, jobId, reason) {
    const job = await getJobOrFail(jobId);
    if (job.status === client_1.JobStatus.CLOSED) {
        throw new appError_1.AppError("JOB_ALREADY_CLOSED", "Job is already closed", 400);
    }
    if (job.status === client_1.JobStatus.REJECTED) {
        throw new appError_1.AppError("JOB_REJECTED", "Rejected job cannot be closed", 400);
    }
    const updatedJob = await (0, job_repository_1.updateJobStatusRecord)(job.id, client_1.JobStatus.CLOSED);
    await (0, job_repository_1.createJobAdminActionRecord)({
        adminUserId,
        jobId: job.id,
        action: client_1.AdminActionType.CLOSED,
        reason,
    });
    return updatedJob;
}
//# sourceMappingURL=job.service.js.map