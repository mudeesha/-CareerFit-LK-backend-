"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleInterviewService = scheduleInterviewService;
exports.updateInterviewService = updateInterviewService;
exports.cancelInterviewService = cancelInterviewService;
const client_1 = require("@prisma/client");
const interview_repository_1 = require("../../repositories/employer/interview.repository");
const appError_1 = require("../../utils/appError");
async function getEmployerCompanyOrFail(userId) {
    const employer = await (0, interview_repository_1.findEmployerByUserId)(userId);
    if (!employer) {
        throw new appError_1.AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
    }
    if (!employer.companyId || !employer.company) {
        throw new appError_1.AppError("COMPANY_NOT_FOUND", "Employer is not linked to a company", 400);
    }
    if (employer.company.status !== client_1.CompanyStatus.APPROVED) {
        throw new appError_1.AppError("COMPANY_NOT_APPROVED", "Company must be approved before managing interviews", 403);
    }
    return employer.company;
}
async function scheduleInterviewService(userId, applicationId, data) {
    const company = await getEmployerCompanyOrFail(userId);
    const application = await (0, interview_repository_1.findApplicationForEmployer)(company.id, applicationId);
    if (!application) {
        throw new appError_1.AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
    }
    if (application.status === client_1.ApplicationStatus.WITHDRAWN) {
        throw new appError_1.AppError("APPLICATION_WITHDRAWN", "Withdrawn applications cannot be scheduled for interview", 400);
    }
    if (application.status === client_1.ApplicationStatus.REJECTED) {
        throw new appError_1.AppError("APPLICATION_REJECTED", "Rejected applications cannot be scheduled for interview", 400);
    }
    if (application.status === client_1.ApplicationStatus.HIRED) {
        throw new appError_1.AppError("APPLICATION_HIRED", "Hired applications cannot be scheduled for interview", 400);
    }
    if (application.interview) {
        throw new appError_1.AppError("INTERVIEW_ALREADY_EXISTS", "Interview already exists for this application. Please update the interview instead.", 409);
    }
    const interview = await (0, interview_repository_1.createInterviewRecord)(application.id, data);
    await (0, interview_repository_1.updateApplicationStatusToInterviewScheduled)(application.id);
    return interview;
}
async function updateInterviewService(userId, interviewId, data) {
    const company = await getEmployerCompanyOrFail(userId);
    const interview = await (0, interview_repository_1.findInterviewForEmployer)(company.id, interviewId);
    if (!interview) {
        throw new appError_1.AppError("INTERVIEW_NOT_FOUND", "Interview not found", 404);
    }
    if (interview.status === client_1.InterviewStatus.CANCELLED) {
        throw new appError_1.AppError("INTERVIEW_CANCELLED", "Cancelled interviews cannot be updated", 400);
    }
    return (0, interview_repository_1.updateInterviewRecord)(interview.id, data);
}
async function cancelInterviewService(userId, interviewId) {
    const company = await getEmployerCompanyOrFail(userId);
    const interview = await (0, interview_repository_1.findInterviewForEmployer)(company.id, interviewId);
    if (!interview) {
        throw new appError_1.AppError("INTERVIEW_NOT_FOUND", "Interview not found", 404);
    }
    if (interview.status === client_1.InterviewStatus.CANCELLED) {
        throw new appError_1.AppError("INTERVIEW_ALREADY_CANCELLED", "Interview is already cancelled", 400);
    }
    return (0, interview_repository_1.cancelInterviewRecord)(interview.id);
}
//# sourceMappingURL=interview.service.js.map