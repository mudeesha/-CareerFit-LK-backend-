"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerJobsService = getEmployerJobsService;
exports.createEmployerJobService = createEmployerJobService;
exports.getEmployerJobByIdService = getEmployerJobByIdService;
exports.updateEmployerJobService = updateEmployerJobService;
exports.closeEmployerJobService = closeEmployerJobService;
const client_1 = require("@prisma/client");
const job_repository_1 = require("../../repositories/employer/job.repository");
const appError_1 = require("../../utils/appError");
async function getEmployerCompanyOrFail(userId) {
    const employer = await (0, job_repository_1.findEmployerByUserId)(userId);
    if (!employer) {
        throw new appError_1.AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
    }
    if (!employer.companyId || !employer.company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Employer is not linked to a company", 400);
    }
    if (employer.company.status !== client_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_NOT_APPROVED", "Company must be approved before managing jobs", 403);
    }
    return employer.company;
}
async function validateCategory(categoryId) {
    if (!categoryId)
        return;
    const category = await (0, job_repository_1.findCategoryById)(categoryId);
    if (!category) {
        throw new appError_1.AppError("CATEGORY_NOT_FOUND", "Category not found", 404);
    }
}
function validateSalaryRange(salaryMin, salaryMax) {
    if (salaryMin !== undefined &&
        salaryMax !== undefined &&
        salaryMin > salaryMax) {
        throw new appError_1.AppError("INVALID_SALARY_RANGE", "Minimum salary cannot be greater than maximum salary", 400);
    }
}
async function getEmployerJobsService(userId) {
    const company = await getEmployerCompanyOrFail(userId);
    const jobs = await (0, job_repository_1.findEmployerJobs)(company.id);
    return {
        items: jobs,
        count: jobs.length,
    };
}
async function createEmployerJobService(userId, data) {
    const company = await getEmployerCompanyOrFail(userId);
    await validateCategory(data.categoryId);
    validateSalaryRange(data.salaryMin, data.salaryMax);
    return (0, job_repository_1.createEmployerJobRecord)(company.id, data);
}
async function getEmployerJobByIdService(userId, jobId) {
    const company = await getEmployerCompanyOrFail(userId);
    const job = await (0, job_repository_1.findEmployerJobById)(company.id, jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    return job;
}
async function updateEmployerJobService(userId, jobId, data) {
    const company = await getEmployerCompanyOrFail(userId);
    const job = await (0, job_repository_1.findEmployerJobById)(company.id, jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    if (job.status === client_1.JobStatus.CLOSED) {
        throw new appError_1.AppError("JOB_CLOSED", "Closed jobs cannot be updated", 400);
    }
    await validateCategory(data.categoryId);
    validateSalaryRange(data.salaryMin ?? job.salaryMin, data.salaryMax ?? job.salaryMax);
    return (0, job_repository_1.updateEmployerJobRecord)(job.id, data);
}
async function closeEmployerJobService(userId, jobId) {
    const company = await getEmployerCompanyOrFail(userId);
    const job = await (0, job_repository_1.findEmployerJobById)(company.id, jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    if (job.status === client_1.JobStatus.CLOSED) {
        throw new appError_1.AppError("JOB_ALREADY_CLOSED", "Job is already closed", 400);
    }
    return (0, job_repository_1.closeEmployerJobRecord)(job.id);
}
//# sourceMappingURL=job.service.js.map