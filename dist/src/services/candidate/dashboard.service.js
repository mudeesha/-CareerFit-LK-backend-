"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidateDashboardService = getCandidateDashboardService;
const dashboard_repository_1 = require("../../repositories/candidate/dashboard.repository");
const appError_1 = require("../../utils/appError");
function toStringArray(value) {
    if (Array.isArray(value)) {
        return value.map(String);
    }
    return [];
}
function normalizeSkill(skill) {
    return skill.trim().toLowerCase();
}
function calculateMatchScore(candidateSkillsValue, jobSkillsValue) {
    const candidateSkills = toStringArray(candidateSkillsValue).map(normalizeSkill);
    const jobSkills = toStringArray(jobSkillsValue).map(normalizeSkill);
    if (jobSkills.length === 0) {
        return 0;
    }
    const matchedSkills = jobSkills.filter((skill) => candidateSkills.includes(skill));
    return Math.round((matchedSkills.length / jobSkills.length) * 100);
}
function buildSkillGapInsights(candidateSkillsValue, jobs) {
    const candidateSkills = new Set(toStringArray(candidateSkillsValue).map(normalizeSkill));
    const demandCount = new Map();
    jobs.forEach((job) => {
        toStringArray(job.skills).forEach((skill) => {
            const trimmedSkill = skill.trim();
            if (!trimmedSkill) {
                return;
            }
            demandCount.set(trimmedSkill, (demandCount.get(trimmedSkill) || 0) + 1);
        });
    });
    return Array.from(demandCount.entries())
        .filter(([skill]) => !candidateSkills.has(normalizeSkill(skill)))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill, count]) => ({
        skill,
        demand: count >= 5
            ? "High demand"
            : count >= 2
                ? "Medium demand"
                : "Low demand",
        match: Math.max(20, 100 - count * 10),
    }));
}
async function getCandidateDashboardService(userId) {
    const candidate = await (0, dashboard_repository_1.findCandidateDashboardProfile)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    const appliedJobs = await (0, dashboard_repository_1.findCandidateAppliedJobIds)(candidate.id);
    const excludedJobIds = appliedJobs.map((application) => application.jobId);
    const [totalApplications, shortlistedApplications, savedJobs, recentApplications, recommendedJobs, platformJobs,] = await Promise.all([
        (0, dashboard_repository_1.countCandidateApplications)(candidate.id),
        (0, dashboard_repository_1.countCandidateShortlistedApplications)(candidate.id),
        (0, dashboard_repository_1.countCandidateSavedJobs)(candidate.id),
        (0, dashboard_repository_1.findRecentCandidateApplications)(candidate.id),
        (0, dashboard_repository_1.findRecommendedJobs)(excludedJobIds),
        (0, dashboard_repository_1.findPlatformActiveJobsForSkillInsights)(),
    ]);
    const latestCvAnalysis = candidate.cvAnalyses[0] || null;
    const recommendedJobsWithMatch = recommendedJobs.map((job) => ({
        ...job,
        matchScore: calculateMatchScore(candidate.skills, job.skills),
    }));
    return {
        profile: {
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.user.email,
            currentRole: candidate.currentRole,
            district: candidate.district,
            experienceYears: candidate.experienceYears,
            expectedSalary: candidate.expectedSalary,
            skills: candidate.skills,
            profileCompletion: candidate.profileCompletion,
        },
        stats: {
            profileCompletion: candidate.profileCompletion,
            cvReadiness: latestCvAnalysis?.strengthScore || 0,
            applications: totalApplications,
            shortlisted: shortlistedApplications,
            savedJobs,
        },
        recommendedJobs: recommendedJobsWithMatch,
        recentApplications,
        skillGapInsights: buildSkillGapInsights(candidate.skills, platformJobs),
        latestCvAnalysis,
    };
}
//# sourceMappingURL=dashboard.service.js.map