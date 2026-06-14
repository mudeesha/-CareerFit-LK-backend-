"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerCompanyService = getEmployerCompanyService;
exports.updateEmployerCompanyService = updateEmployerCompanyService;
const client_1 = require("@prisma/client");
const company_repository_1 = require("../../repositories/employer/company.repository");
const appError_1 = require("../../utils/appError");
async function getEmployerCompanyOrFail(userId) {
    const employer = await (0, company_repository_1.findEmployerByUserId)(userId);
    if (!employer) {
        throw new appError_1.AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
    }
    if (!employer.companyId || !employer.company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Employer is not linked to a company", 400);
    }
    return employer.company;
}
async function getEmployerCompanyService(userId) {
    const company = await getEmployerCompanyOrFail(userId);
    return company;
}
async function updateEmployerCompanyService(userId, data) {
    const company = await getEmployerCompanyOrFail(userId);
    if (company.status === client_1.CompanyStatus.SUSPENDED) {
        throw new appError_1.AppError("COMPANY_SUSPENDED", "Suspended company profile cannot be updated", 403);
    }
    const latestCompany = await (0, company_repository_1.findEmployerCompanyById)(company.id);
    if (!latestCompany) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Company not found", 404);
    }
    return (0, company_repository_1.updateEmployerCompanyRecord)(latestCompany.id, data);
}
//# sourceMappingURL=company.service.js.map