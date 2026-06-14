"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompaniesService = getCompaniesService;
exports.getCompanyByIdService = getCompanyByIdService;
const company_repository_1 = require("../../repositories/public/company.repository");
const appError_1 = require("../../utils/appError");
async function getCompaniesService() {
    const companies = await (0, company_repository_1.findCompanies)();
    return {
        items: companies,
        count: companies.length,
    };
}
async function getCompanyByIdService(id) {
    const company = await (0, company_repository_1.findCompanyById)(id);
    if (!company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Company not found", 404);
    }
    return company;
}
//# sourceMappingURL=company.service.js.map