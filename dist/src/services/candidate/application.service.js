"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationService = createApplicationService;
exports.getMyApplicationsService = getMyApplicationsService;
exports.withdrawApplicationService = withdrawApplicationService;
const application_repository_1 = require("../../repositories/candidate/application.repository");
const appError_1 = require("../../utils/appError");
async function createApplicationService(userId, data) {
    const candidate = await (0, application_repository_1.findCandidateByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    const job = await (0, application_repository_1.findJobForApplication)(data.jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    if (job.status !== "ACTIVE") {
        throw new appError_1.AppError("JOB_NOT_ACTIVE", "This job is not active", 400);
    }
    const existingActiveApplication = await (0, application_repository_1.findActiveApplicationByCandidateAndJob)(candidate.id, job.id);
    if (existingActiveApplication) {
        throw new appError_1.AppError("ALREADY_APPLIED", "You have already applied for this job", 409);
    }
    const matchScore = calculateSimpleMatchScore(candidate.skills, job.skills);
    const application = await (0, application_repository_1.createApplicationRecord)({
        candidateId: candidate.id,
        jobId: job.id,
        coverLetter: data.coverLetter,
        matchScore,
    });
    await (0, application_repository_1.incrementJobApplicantCount)(job.id);
    return application;
}
async function getMyApplicationsService(userId) {
    const candidate = await (0, application_repository_1.findCandidateByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    return (0, application_repository_1.findMyApplications)(candidate.id);
}
async function withdrawApplicationService(userId, applicationId) {
    const candidate = await (0, application_repository_1.findCandidateByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    const application = await (0, application_repository_1.findApplicationById)(applicationId);
    if (!application) {
        throw new appError_1.AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
    }
    if (application.candidateId !== candidate.id) {
        throw new appError_1.AppError("FORBIDDEN", "You cannot withdraw this application", 403);
    }
    if (application.status === "WITHDRAWN") {
        throw new appError_1.AppError("APPLICATION_ALREADY_WITHDRAWN", "Application is already withdrawn", 400);
    }
    return (0, application_repository_1.withdrawApplicationRecord)(applicationId);
}
function calculateSimpleMatchScore(candidateSkillsValue, jobSkillsValue) {
    const candidateSkills = Array.isArray(candidateSkillsValue)
        ? candidateSkillsValue.map((skill) => String(skill).toLowerCase())
        : [];
    const jobSkills = Array.isArray(jobSkillsValue)
        ? jobSkillsValue.map((skill) => String(skill).toLowerCase())
        : [];
    if (jobSkills.length === 0) {
        return 0;
    }
    const matchedSkills = jobSkills.filter((skill) => candidateSkills.includes(skill));
    return Math.round((matchedSkills.length / jobSkills.length) * 100);
}
//# sourceMappingURL=application.service.js.map