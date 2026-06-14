"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJobService = saveJobService;
exports.getMySavedJobsService = getMySavedJobsService;
exports.removeSavedJobService = removeSavedJobService;
const savedJob_repository_1 = require("../../repositories/candidate/savedJob.repository");
const appError_1 = require("../../utils/appError");
async function getCandidateOrFail(userId) {
    const candidate = await (0, savedJob_repository_1.findCandidateByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    return candidate;
}
async function saveJobService(userId, jobId) {
    const candidate = await getCandidateOrFail(userId);
    const job = await (0, savedJob_repository_1.findActiveJobById)(jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Active job not found", 404);
    }
    const existingSavedJob = await (0, savedJob_repository_1.findSavedJob)(candidate.id, job.id);
    if (existingSavedJob) {
        throw new appError_1.AppError("JOB_ALREADY_SAVED", "Job is already saved", 409);
    }
    return (0, savedJob_repository_1.createSavedJobRecord)(candidate.id, job.id);
}
async function getMySavedJobsService(userId) {
    const candidate = await getCandidateOrFail(userId);
    const savedJobs = await (0, savedJob_repository_1.findSavedJobsByCandidate)(candidate.id);
    return {
        items: savedJobs,
        count: savedJobs.length,
    };
}
async function removeSavedJobService(userId, jobId) {
    const candidate = await getCandidateOrFail(userId);
    const savedJob = await (0, savedJob_repository_1.findSavedJob)(candidate.id, jobId);
    if (!savedJob) {
        throw new appError_1.AppError("SAVED_JOB_NOT_FOUND", "Saved job not found", 404);
    }
    await (0, savedJob_repository_1.deleteSavedJobRecord)(candidate.id, jobId);
    return {
        id: savedJob.id,
        jobId: savedJob.jobId,
        removed: true,
    };
}
//# sourceMappingURL=savedJob.service.js.map