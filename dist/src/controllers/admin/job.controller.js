"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingJobsController = getPendingJobsController;
exports.approveJobController = approveJobController;
exports.rejectJobController = rejectJobController;
exports.featureJobController = featureJobController;
exports.closeJobController = closeJobController;
const job_dto_1 = require("../../dtos/admin/job.dto");
const job_service_1 = require("../../services/admin/job.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
function getJobIdParam(req) {
    const { id } = job_dto_1.adminJobParamSchema.parse(req.params);
    return id;
}
async function getPendingJobsController(req, res) {
    getAuthUserId(req);
    const data = await (0, job_service_1.getPendingJobsService)();
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function approveJobController(req, res) {
    const adminUserId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const job = await (0, job_service_1.approveJobService)(adminUserId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job approved successfully");
}
async function rejectJobController(req, res) {
    const adminUserId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const data = job_dto_1.rejectJobSchema.parse(req.body);
    const job = await (0, job_service_1.rejectJobService)(adminUserId, jobId, data.reason);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job rejected successfully");
}
async function featureJobController(req, res) {
    const adminUserId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const data = job_dto_1.featureJobSchema.parse(req.body || {});
    const job = await (0, job_service_1.featureJobService)(adminUserId, jobId, data.isFeatured);
    return (0, apiResponse_1.sendSuccess)(res, job, job.isFeatured ? "Job marked as featured" : "Job removed from featured");
}
async function closeJobController(req, res) {
    const adminUserId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const data = job_dto_1.closeJobSchema.parse(req.body || {});
    const job = await (0, job_service_1.closeJobService)(adminUserId, jobId, data.reason);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job closed successfully");
}
//# sourceMappingURL=job.controller.js.map