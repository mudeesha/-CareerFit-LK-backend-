"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleInterviewController = scheduleInterviewController;
exports.updateInterviewController = updateInterviewController;
exports.cancelInterviewController = cancelInterviewController;
const interview_dto_1 = require("../../dtos/employer/interview.dto");
const interview_service_1 = require("../../services/employer/interview.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
function getApplicationIdParam(req) {
    const { id } = interview_dto_1.employerApplicationInterviewParamSchema.parse(req.params);
    return id;
}
function getInterviewIdParam(req) {
    const { id } = interview_dto_1.employerInterviewParamSchema.parse(req.params);
    return id;
}
async function scheduleInterviewController(req, res) {
    const userId = getAuthUserId(req);
    const applicationId = getApplicationIdParam(req);
    const data = interview_dto_1.scheduleInterviewSchema.parse(req.body);
    const interview = await (0, interview_service_1.scheduleInterviewService)(userId, applicationId, data);
    return (0, apiResponse_1.sendSuccess)(res, interview, "Interview scheduled successfully", 201);
}
async function updateInterviewController(req, res) {
    const userId = getAuthUserId(req);
    const interviewId = getInterviewIdParam(req);
    const data = interview_dto_1.updateInterviewSchema.parse(req.body);
    const interview = await (0, interview_service_1.updateInterviewService)(userId, interviewId, data);
    return (0, apiResponse_1.sendSuccess)(res, interview, "Interview updated successfully");
}
async function cancelInterviewController(req, res) {
    const userId = getAuthUserId(req);
    const interviewId = getInterviewIdParam(req);
    const interview = await (0, interview_service_1.cancelInterviewService)(userId, interviewId);
    return (0, apiResponse_1.sendSuccess)(res, interview, "Interview cancelled successfully");
}
//# sourceMappingURL=interview.controller.js.map