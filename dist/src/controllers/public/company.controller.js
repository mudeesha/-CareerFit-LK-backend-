"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompaniesController = getCompaniesController;
exports.getCompanyByIdController = getCompanyByIdController;
const company_dto_1 = require("../../dtos/public/company.dto");
const company_service_1 = require("../../services/public/company.service");
const apiResponse_1 = require("../../utils/apiResponse");
async function getCompaniesController(_req, res) {
    const data = await (0, company_service_1.getCompaniesService)();
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function getCompanyByIdController(req, res) {
    const { id } = company_dto_1.companyIdParamSchema.parse(req.params);
    const company = await (0, company_service_1.getCompanyByIdService)(id);
    return (0, apiResponse_1.sendSuccess)(res, company);
}
//# sourceMappingURL=company.controller.js.map