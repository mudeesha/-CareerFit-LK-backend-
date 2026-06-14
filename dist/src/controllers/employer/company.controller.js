"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerCompanyController = getEmployerCompanyController;
exports.updateEmployerCompanyController = updateEmployerCompanyController;
const company_dto_1 = require("../../dtos/employer/company.dto");
const company_service_1 = require("../../services/employer/company.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function getEmployerCompanyController(req, res) {
    const userId = getAuthUserId(req);
    const company = await (0, company_service_1.getEmployerCompanyService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, company);
}
async function updateEmployerCompanyController(req, res) {
    const userId = getAuthUserId(req);
    const data = company_dto_1.updateEmployerCompanySchema.parse(req.body);
    const company = await (0, company_service_1.updateEmployerCompanyService)(userId, data);
    return (0, apiResponse_1.sendSuccess)(res, company, "Company profile updated successfully");
}
//# sourceMappingURL=company.controller.js.map