"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobMatchController = getJobMatchController;
const match_service_1 = require("../../services/candidate/match.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function getJobMatchController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = req.params.id;
    if (!jobId || Array.isArray(jobId)) {
        throw new appError_1.AppError("INVALID_JOB_ID", "Invalid job ID", 400);
    }
    const match = await (0, match_service_1.getJobMatchService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, match);
}
//# sourceMappingURL=match.controller.js.map