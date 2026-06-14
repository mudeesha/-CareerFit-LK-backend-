"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingCompaniesController = getPendingCompaniesController;
exports.approveCompanyController = approveCompanyController;
exports.rejectCompanyController = rejectCompanyController;
exports.suspendCompanyController = suspendCompanyController;
const company_dto_1 = require("../../dtos/admin/company.dto");
const company_service_1 = require("../../services/admin/company.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
function getCompanyIdParam(req) {
    const { id } = company_dto_1.adminCompanyParamSchema.parse(req.params);
    return id;
}
async function getPendingCompaniesController(req, res) {
    getAuthUserId(req);
    const data = await (0, company_service_1.getPendingCompaniesService)();
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function approveCompanyController(req, res) {
    const adminUserId = getAuthUserId(req);
    const companyId = getCompanyIdParam(req);
    const company = await (0, company_service_1.approveCompanyService)(adminUserId, companyId);
    return (0, apiResponse_1.sendSuccess)(res, company, "Company approved successfully");
}
async function rejectCompanyController(req, res) {
    const adminUserId = getAuthUserId(req);
    const companyId = getCompanyIdParam(req);
    const data = company_dto_1.rejectCompanySchema.parse(req.body);
    const company = await (0, company_service_1.rejectCompanyService)(adminUserId, companyId, data.reason);
    return (0, apiResponse_1.sendSuccess)(res, company, "Company rejected successfully");
}
async function suspendCompanyController(req, res) {
    const adminUserId = getAuthUserId(req);
    const companyId = getCompanyIdParam(req);
    const data = company_dto_1.suspendCompanySchema.parse(req.body);
    const company = await (0, company_service_1.suspendCompanyService)(adminUserId, companyId, data.reason);
    return (0, apiResponse_1.sendSuccess)(res, company, "Company suspended successfully");
}
//# sourceMappingURL=company.controller.js.map