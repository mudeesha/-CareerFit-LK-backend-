"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerJobApplicantsService = getEmployerJobApplicantsService;
exports.markApplicationViewedService = markApplicationViewedService;
exports.shortlistApplicationService = shortlistApplicationService;
exports.rejectApplicationService = rejectApplicationService;
exports.hireApplicationService = hireApplicationService;
const client_1 = require("@prisma/client");
const applicant_repository_1 = require("../../repositories/employer/applicant.repository");
const appError_1 = require("../../utils/appError");
async function getEmployerCompanyOrFail(userId) {
    const employer = await (0, applicant_repository_1.findEmployerByUserId)(userId);
    if (!employer) {
        throw new appError_1.AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
    }
    if (!employer.companyId || !employer.company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Employer is not linked to a company", 400);
    }
    if (employer.company.status !== client_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_NOT_APPROVED", "Company must be approved before managing applicants", 403);
    }
    return employer.company;
}
async function getEmployerApplicationOrFail(userId, applicationId) {
    const company = await getEmployerCompanyOrFail(userId);
    const application = await (0, applicant_repository_1.findApplicationForEmployer)(company.id, applicationId);
    if (!application) {
        throw new appError_1.AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
    }
    if (application.status === client_1.ApplicationStatus.WITHDRAWN) {
        throw new appError_1.AppError("APPLICATION_WITHDRAWN", "Withdrawn applications cannot be updated", 400);
    }
    return application;
}
async function getEmployerJobApplicantsService(userId, jobId) {
    const company = await getEmployerCompanyOrFail(userId);
    const job = await (0, applicant_repository_1.findEmployerJobById)(company.id, jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    const applicants = await (0, applicant_repository_1.findApplicantsByJobId)(job.id);
    return {
        job,
        items: applicants,
        count: applicants.length,
    };
}
async function markApplicationViewedService(userId, applicationId) {
    const application = await getEmployerApplicationOrFail(userId, applicationId);
    if (application.status !== client_1.ApplicationStatus.APPLIED) {
        return application;
    }
    return (0, applicant_repository_1.updateApplicationStatusRecord)(application.id, client_1.ApplicationStatus.VIEWED);
}
async function shortlistApplicationService(userId, applicationId) {
    const application = await getEmployerApplicationOrFail(userId, applicationId);
    if (application.status === client_1.ApplicationStatus.REJECTED ||
        application.status === client_1.ApplicationStatus.HIRED) {
        throw new appError_1.AppError("INVALID_APPLICATION_STATUS", "Rejected or hired applications cannot be shortlisted", 400);
    }
    return (0, applicant_repository_1.updateApplicationStatusRecord)(application.id, client_1.ApplicationStatus.SHORTLISTED);
}
async function rejectApplicationService(userId, applicationId) {
    const application = await getEmployerApplicationOrFail(userId, applicationId);
    if (application.status === client_1.ApplicationStatus.HIRED) {
        throw new appError_1.AppError("APPLICATION_ALREADY_HIRED", "Hired applications cannot be rejected", 400);
    }
    return (0, applicant_repository_1.updateApplicationStatusRecord)(application.id, client_1.ApplicationStatus.REJECTED);
}
async function hireApplicationService(userId, applicationId) {
    const application = await getEmployerApplicationOrFail(userId, applicationId);
    if (application.status === client_1.ApplicationStatus.REJECTED) {
        throw new appError_1.AppError("APPLICATION_REJECTED", "Rejected applications cannot be hired", 400);
    }
    return (0, applicant_repository_1.updateApplicationStatusRecord)(application.id, client_1.ApplicationStatus.HIRED);
}
//# sourceMappingURL=applicant.service.js.map