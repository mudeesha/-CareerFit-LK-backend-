"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationController = createApplicationController;
exports.getMyApplicationsController = getMyApplicationsController;
exports.withdrawApplicationController = withdrawApplicationController;
const application_dto_1 = require("../../dtos/candidate/application.dto");
const application_service_1 = require("../../services/candidate/application.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function createApplicationController(req, res) {
    const userId = getAuthUserId(req);
    const data = application_dto_1.createApplicationSchema.parse(req.body);
    const application = await (0, application_service_1.createApplicationService)(userId, data);
    return (0, apiResponse_1.sendSuccess)(res, application, "Application submitted successfully", 201);
}
async function getMyApplicationsController(req, res) {
    const userId = getAuthUserId(req);
    const applications = await (0, application_service_1.getMyApplicationsService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, {
        items: applications,
        count: applications.length,
    });
}
async function withdrawApplicationController(req, res) {
    const userId = getAuthUserId(req);
    const { id: applicationId } = application_dto_1.applicationIdParamSchema.parse(req.params);
    const application = await (0, application_service_1.withdrawApplicationService)(userId, applicationId);
    return (0, apiResponse_1.sendSuccess)(res, application, "Application withdrawn successfully");
}
//# sourceMappingURL=application.controller.js.map