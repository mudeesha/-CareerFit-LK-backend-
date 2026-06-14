"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJobController = saveJobController;
exports.getMySavedJobsController = getMySavedJobsController;
exports.removeSavedJobController = removeSavedJobController;
const savedJob_dto_1 = require("../../dtos/candidate/savedJob.dto");
const savedJob_service_1 = require("../../services/candidate/savedJob.service");
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
    const { jobId } = savedJob_dto_1.savedJobParamSchema.parse(req.params);
    return jobId;
}
async function saveJobController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const savedJob = await (0, savedJob_service_1.saveJobService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, savedJob, "Job saved successfully", 201);
}
async function getMySavedJobsController(req, res) {
    const userId = getAuthUserId(req);
    const data = await (0, savedJob_service_1.getMySavedJobsService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function removeSavedJobController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const result = await (0, savedJob_service_1.removeSavedJobService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, result, "Saved job removed successfully");
}
//# sourceMappingURL=savedJob.controller.js.map