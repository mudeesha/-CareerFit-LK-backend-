"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingCompaniesService = getPendingCompaniesService;
exports.approveCompanyService = approveCompanyService;
exports.rejectCompanyService = rejectCompanyService;
exports.suspendCompanyService = suspendCompanyService;
const client_1 = require("@prisma/client");
const company_repository_1 = require("../../repositories/admin/company.repository");
const appError_1 = require("../../utils/appError");
async function getCompanyOrFail(companyId) {
    const company = await (0, company_repository_1.findCompanyById)(companyId);
    if (!company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Company not found", 404);
    }
    return company;
}
async function getPendingCompaniesService() {
    const companies = await (0, company_repository_1.findPendingCompanies)();
    return {
        items: companies,
        count: companies.length,
    };
}
async function approveCompanyService(adminUserId, companyId) {
    const company = await getCompanyOrFail(companyId);
    if (company.status === client_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_ALREADY_APPROVED", "Company is already approved", 400);
    }
    if (company.status === client_1.CompanyStatus.SUSPENDED) {
        throw new appError_1.AppError("COMPANY_SUSPENDED", "Suspended company cannot be approved directly", 400);
    }
    const updatedCompany = await (0, company_repository_1.updateCompanyStatusRecord)(company.id, client_1.CompanyStatus.APPROVED);
    await (0, company_repository_1.createCompanyAdminActionRecord)({
        adminUserId,
        companyId: company.id,
        action: client_1.AdminActionType.APPROVED,
    });
    return updatedCompany;
}
async function rejectCompanyService(adminUserId, companyId, reason) {
    const company = await getCompanyOrFail(companyId);
    if (company.status === client_1.CompanyStatus.REJECTED) {
        throw new appError_1.AppError("COMPANY_ALREADY_REJECTED", "Company is already rejected", 400);
    }
    if (company.status === client_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_ALREADY_APPROVED", "Approved company cannot be rejected. Suspend it instead.", 400);
    }
    const updatedCompany = await (0, company_repository_1.updateCompanyStatusRecord)(company.id, client_1.CompanyStatus.REJECTED);
    await (0, company_repository_1.createCompanyAdminActionRecord)({
        adminUserId,
        companyId: company.id,
        action: client_1.AdminActionType.REJECTED,
        reason,
    });
    return updatedCompany;
}
async function suspendCompanyService(adminUserId, companyId, reason) {
    const company = await getCompanyOrFail(companyId);
    if (company.status === client_1.CompanyStatus.SUSPENDED) {
        throw new appError_1.AppError("COMPANY_ALREADY_SUSPENDED", "Company is already suspended", 400);
    }
    if (company.status === client_1.CompanyStatus.REJECTED) {
        throw new appError_1.AppError("COMPANY_REJECTED", "Rejected company cannot be suspended", 400);
    }
    const updatedCompany = await (0, company_repository_1.updateCompanyStatusRecord)(company.id, client_1.CompanyStatus.SUSPENDED);
    await (0, company_repository_1.createCompanyAdminActionRecord)({
        adminUserId,
        companyId: company.id,
        action: client_1.AdminActionType.SUSPENDED,
        reason,
    });
    return updatedCompany;
}
//# sourceMappingURL=company.service.js.map