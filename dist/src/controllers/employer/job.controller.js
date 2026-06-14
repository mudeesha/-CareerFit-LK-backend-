"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerJobsController = getEmployerJobsController;
exports.createEmployerJobController = createEmployerJobController;
exports.getEmployerJobByIdController = getEmployerJobByIdController;
exports.updateEmployerJobController = updateEmployerJobController;
exports.closeEmployerJobController = closeEmployerJobController;
const job_dto_1 = require("../../dtos/employer/job.dto");
const job_service_1 = require("../../services/employer/job.service");
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
    const { id } = job_dto_1.employerJobParamSchema.parse(req.params);
    return id;
}
async function getEmployerJobsController(req, res) {
    const userId = getAuthUserId(req);
    const data = await (0, job_service_1.getEmployerJobsService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function createEmployerJobController(req, res) {
    const userId = getAuthUserId(req);
    const data = job_dto_1.createEmployerJobSchema.parse(req.body);
    const job = await (0, job_service_1.createEmployerJobService)(userId, data);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job created successfully", 201);
}
async function getEmployerJobByIdController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const job = await (0, job_service_1.getEmployerJobByIdService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, job);
}
async function updateEmployerJobController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const data = job_dto_1.updateEmployerJobSchema.parse(req.body);
    const job = await (0, job_service_1.updateEmployerJobService)(userId, jobId, data);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job updated successfully");
}
async function closeEmployerJobController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const job = await (0, job_service_1.closeEmployerJobService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, job, "Job closed successfully");
}
//# sourceMappingURL=job.controller.js.map