"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerJobApplicantsController = getEmployerJobApplicantsController;
exports.markApplicationViewedController = markApplicationViewedController;
exports.shortlistApplicationController = shortlistApplicationController;
exports.rejectApplicationController = rejectApplicationController;
exports.hireApplicationController = hireApplicationController;
const applicant_dto_1 = require("../../dtos/employer/applicant.dto");
const applicant_service_1 = require("../../services/employer/applicant.service");
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
    const { id } = applicant_dto_1.employerJobApplicantParamSchema.parse(req.params);
    return id;
}
function getApplicationIdParam(req) {
    const { id } = applicant_dto_1.employerApplicationParamSchema.parse(req.params);
    return id;
}
async function getEmployerJobApplicantsController(req, res) {
    const userId = getAuthUserId(req);
    const jobId = getJobIdParam(req);
    const data = await (0, applicant_service_1.getEmployerJobApplicantsService)(userId, jobId);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function markApplicationViewedController(req, res) {
    const userId = getAuthUserId(req);
    const applicationId = getApplicationIdParam(req);
    const application = await (0, applicant_service_1.markApplicationViewedService)(userId, applicationId);
    return (0, apiResponse_1.sendSuccess)(res, application, "Application marked as viewed");
}
async function shortlistApplicationController(req, res) {
    const userId = getAuthUserId(req);
    const applicationId = getApplicationIdParam(req);
    const application = await (0, applicant_service_1.shortlistApplicationService)(userId, applicationId);
    return (0, apiResponse_1.sendSuccess)(res, application, "Applicant shortlisted successfully");
}
async function rejectApplicationController(req, res) {
    const userId = getAuthUserId(req);
    const applicationId = getApplicationIdParam(req);
    applicant_dto_1.rejectApplicationSchema.parse(req.body);
    const application = await (0, applicant_service_1.rejectApplicationService)(userId, applicationId);
    return (0, apiResponse_1.sendSuccess)(res, application, "Applicant rejected successfully");
}
async function hireApplicationController(req, res) {
    const userId = getAuthUserId(req);
    const applicationId = getApplicationIdParam(req);
    const application = await (0, applicant_service_1.hireApplicationService)(userId, applicationId);
    return (0, apiResponse_1.sendSuccess)(res, application, "Applicant hired successfully");
}
//# sourceMappingURL=applicant.controller.js.map