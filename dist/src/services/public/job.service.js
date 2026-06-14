"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsService = getJobsService;
exports.getJobByIdService = getJobByIdService;
const job_repository_1 = require("../../repositories/public/job.repository");
const appError_1 = require("../../utils/appError");
async function getJobsService(filters) {
    const jobs = await (0, job_repository_1.findJobs)(filters);
    return {
        items: jobs,
        count: jobs.length,
    };
}
async function getJobByIdService(id) {
    const job = await (0, job_repository_1.findJobById)(id);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    return job;
}
//# sourceMappingURL=job.service.js.map