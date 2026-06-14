"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCvController = analyzeCvController;
exports.uploadAndAnalyzeCvController = uploadAndAnalyzeCvController;
exports.getMyLatestCvAnalysisController = getMyLatestCvAnalysisController;
exports.getMyCvAnalysesController = getMyCvAnalysesController;
const cv_dto_1 = require("../../dtos/candidate/cv.dto");
const cv_service_1 = require("../../services/candidate/cv.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function analyzeCvController(req, res) {
    const userId = getAuthUserId(req);
    const data = cv_dto_1.analyzeCvSchema.parse(req.body);
    const analysis = await (0, cv_service_1.analyzeCvService)(userId, data);
    return (0, apiResponse_1.sendSuccess)(res, analysis, "CV analyzed successfully", 201);
}
async function uploadAndAnalyzeCvController(req, res) {
    const userId = getAuthUserId(req);
    if (!req.file) {
        throw new appError_1.AppError("CV_FILE_REQUIRED", "CV file is required", 400);
    }
    const analysis = await (0, cv_service_1.uploadAndAnalyzeCvService)(userId, req.file);
    return (0, apiResponse_1.sendSuccess)(res, analysis, "CV uploaded and analyzed successfully", 201);
}
async function getMyLatestCvAnalysisController(req, res) {
    const userId = getAuthUserId(req);
    const analysis = await (0, cv_service_1.getMyLatestCvAnalysisService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, analysis);
}
async function getMyCvAnalysesController(req, res) {
    const userId = getAuthUserId(req);
    const data = await (0, cv_service_1.getMyCvAnalysesService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
//# sourceMappingURL=cv.controller.js.map