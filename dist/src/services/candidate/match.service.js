"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobMatchService = getJobMatchService;
const match_repository_1 = require("../../repositories/candidate/match.repository");
const appError_1 = require("../../utils/appError");
async function getJobMatchService(userId, jobId) {
    const candidate = await (0, match_repository_1.findCandidateForMatchByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    const job = await (0, match_repository_1.findJobForMatch)(jobId);
    if (!job) {
        throw new appError_1.AppError("JOB_NOT_FOUND", "Job not found", 404);
    }
    const candidateSkills = toStringArray(candidate.skills);
    const jobSkills = toStringArray(job.skills);
    const normalizedCandidateSkills = candidateSkills.map((skill) => skill.toLowerCase());
    const matchedSkills = jobSkills.filter((skill) => normalizedCandidateSkills.includes(skill.toLowerCase()));
    const missingSkills = jobSkills.filter((skill) => !normalizedCandidateSkills.includes(skill.toLowerCase()));
    const skillsScore = jobSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / jobSkills.length) * 100);
    const experienceScore = calculateExperienceScore(candidate.experienceYears, job.experienceLevel);
    const locationScore = calculateLocationScore(candidate.preferredLocations, job.location, job.workMode);
    const salaryScore = calculateSalaryScore(candidate.expectedSalary, job.salaryMin, job.salaryMax);
    const languageScore = calculateLanguageScore(candidate.languages);
    const overallScore = Math.round(skillsScore * 0.5 +
        experienceScore * 0.2 +
        locationScore * 0.15 +
        salaryScore * 0.1 +
        languageScore * 0.05);
    return {
        jobId: job.id,
        candidateId: candidate.id,
        overallScore,
        matchLabel: getMatchLabel(overallScore),
        applyReadiness: getApplyReadiness(overallScore),
        breakdown: {
            skills: skillsScore,
            experience: experienceScore,
            location: locationScore,
            salary: salaryScore,
            language: languageScore,
        },
        matchedSkills,
        missingSkills,
        suggestions: buildSuggestions(missingSkills),
        learningPath: buildLearningPath(missingSkills),
    };
}
function toStringArray(value) {
    if (Array.isArray(value)) {
        return value.map(String);
    }
    return [];
}
function calculateExperienceScore(candidateYears, experienceLevel) {
    const requiredYearsMap = {
        ENTRY_LEVEL: 0,
        ONE_TO_TWO_YEARS: 1,
        THREE_TO_FIVE_YEARS: 3,
        FIVE_PLUS_YEARS: 5,
    };
    const requiredYears = requiredYearsMap[experienceLevel] ?? 0;
    if (requiredYears === 0) {
        return 100;
    }
    if (candidateYears >= requiredYears) {
        return 100;
    }
    return Math.round((candidateYears / requiredYears) * 100);
}
function calculateLocationScore(preferredLocationsValue, jobLocation, workMode) {
    if (workMode === "REMOTE") {
        return 100;
    }
    const preferredLocations = toStringArray(preferredLocationsValue).map((loc) => loc.toLowerCase());
    if (preferredLocations.includes(jobLocation.toLowerCase())) {
        return 100;
    }
    return 60;
}
function calculateSalaryScore(expectedSalary, salaryMin, salaryMax) {
    if (!expectedSalary) {
        return 70;
    }
    if (expectedSalary >= salaryMin && expectedSalary <= salaryMax) {
        return 100;
    }
    if (expectedSalary < salaryMin) {
        return 90;
    }
    const difference = expectedSalary - salaryMax;
    const percentageOver = difference / salaryMax;
    if (percentageOver <= 0.1) {
        return 80;
    }
    if (percentageOver <= 0.25) {
        return 60;
    }
    return 40;
}
function calculateLanguageScore(languagesValue) {
    const languages = toStringArray(languagesValue).map((language) => language.toLowerCase());
    if (languages.includes("english") && languages.includes("sinhala")) {
        return 100;
    }
    if (languages.includes("english")) {
        return 80;
    }
    return 60;
}
function getMatchLabel(score) {
    if (score >= 80) {
        return "Strong Match";
    }
    if (score >= 60) {
        return "Good Match";
    }
    return "Low Match";
}
function getApplyReadiness(score) {
    if (score >= 80) {
        return "READY_TO_APPLY";
    }
    if (score >= 60) {
        return "IMPROVE_CV_FIRST";
    }
    return "NOT_RECOMMENDED_YET";
}
function buildSuggestions(missingSkills) {
    if (missingSkills.length === 0) {
        return ["Your CV matches the main job requirements well."];
    }
    return missingSkills.map((skill) => `Add or improve ${skill} experience in your CV.`);
}
function buildLearningPath(missingSkills) {
    if (missingSkills.length === 0) {
        return ["Prepare for interview questions", "Review your project examples"];
    }
    return missingSkills.map((skill) => `${skill} fundamentals`);
}
//# sourceMappingURL=match.service.js.map