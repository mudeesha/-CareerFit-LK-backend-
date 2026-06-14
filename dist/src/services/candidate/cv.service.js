"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCvService = analyzeCvService;
exports.uploadAndAnalyzeCvService = uploadAndAnalyzeCvService;
exports.getMyLatestCvAnalysisService = getMyLatestCvAnalysisService;
exports.getMyCvAnalysesService = getMyCvAnalysesService;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const cv_repository_1 = require("../../repositories/candidate/cv.repository");
const appError_1 = require("../../utils/appError");
const pdfParse = require("pdf-parse");
const LANGUAGE_KEYWORDS = ["Sinhala", "English", "Tamil"];
async function getCandidateOrFail(userId) {
    const candidate = await (0, cv_repository_1.findCandidateForCvByUserId)(userId);
    if (!candidate) {
        throw new appError_1.AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
    }
    return candidate;
}
function normalizeSkill(skill) {
    return skill.trim().replace(/\s+/g, " ");
}
function addJsonSkillsToSet(skillSet, value) {
    if (!Array.isArray(value))
        return;
    for (const skill of value) {
        if (typeof skill === "string" && skill.trim()) {
            skillSet.add(normalizeSkill(skill));
        }
    }
}
function countJsonSkills(counts, value) {
    if (!Array.isArray(value))
        return;
    for (const skill of value) {
        if (typeof skill !== "string")
            continue;
        const normalizedSkill = normalizeSkill(skill);
        if (!normalizedSkill)
            continue;
        counts.set(normalizedSkill, (counts.get(normalizedSkill) || 0) + 1);
    }
}
async function getSkillKeywordsFromDatabase() {
    const { jobs, categories } = await (0, cv_repository_1.findCvSkillSources)();
    const skillSet = new Set();
    for (const job of jobs) {
        addJsonSkillsToSet(skillSet, job.skills);
        addJsonSkillsToSet(skillSet, job.preferredSkills);
    }
    for (const category of categories) {
        addJsonSkillsToSet(skillSet, category.topSkills);
    }
    return Array.from(skillSet);
}
async function getHighDemandSkillsFromDatabase(limit = 10) {
    const { jobs, categories } = await (0, cv_repository_1.findCvSkillSources)();
    const counts = new Map();
    for (const job of jobs) {
        countJsonSkills(counts, job.skills);
        countJsonSkills(counts, job.preferredSkills);
    }
    if (counts.size < limit) {
        for (const category of categories) {
            countJsonSkills(counts, category.topSkills);
        }
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([skill]) => skill);
}
async function extractTextFromCv(file) {
    const fileBuffer = await promises_1.default.readFile(file.path);
    const extension = path_1.default.extname(file.originalname).toLowerCase();
    if (extension === ".pdf") {
        const parsed = await pdfParse(fileBuffer);
        return parsed.text;
    }
    if (extension === ".docx") {
        const parsed = await mammoth_1.default.extractRawText({
            buffer: fileBuffer,
        });
        return parsed.value;
    }
    throw new appError_1.AppError("UNSUPPORTED_CV_FILE", "Only PDF and DOCX files can be analyzed", 400);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function includesSkill(text, skill) {
    const pattern = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegExp(skill)}([^a-zA-Z0-9]|$)`, "i");
    return pattern.test(text);
}
function detectSkills(text, skillKeywords) {
    return skillKeywords.filter((skill) => includesSkill(text, skill));
}
function detectMissingSkills(extractedSkills, highDemandSkills) {
    const extractedSet = new Set(extractedSkills.map((skill) => skill.toLowerCase()));
    return highDemandSkills.filter((skill) => !extractedSet.has(skill.toLowerCase()));
}
function detectLanguages(text) {
    return LANGUAGE_KEYWORDS.filter((language) => includesSkill(text, language));
}
function detectEducation(text) {
    const education = [];
    if (/\bbsc\b|bachelor|degree/i.test(text)) {
        education.push("Bachelor Degree");
    }
    if (/\bmsc\b|master/i.test(text)) {
        education.push("Master Degree");
    }
    if (/diploma/i.test(text)) {
        education.push("Diploma");
    }
    if (/certificate|certification/i.test(text)) {
        education.push("Certification");
    }
    return education;
}
function detectExperienceYears(text) {
    const matches = [
        ...text.matchAll(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years|year|yrs|yr)/gi),
    ];
    if (matches.length === 0)
        return 0;
    const years = matches
        .map((match) => Number(match[1]))
        .filter((value) => !Number.isNaN(value));
    return years.length ? Math.max(...years) : 0;
}
function calculateStrengthScore(params) {
    let score = 20;
    score += Math.min(params.extractedSkills.length * 5, 35);
    score += Math.min(params.experienceYears * 5, 20);
    if (params.education.length > 0)
        score += 10;
    if (params.languages.length > 0)
        score += 5;
    if (/github|portfolio|linkedin/i.test(params.text))
        score += 10;
    if (/project|achievement|improved|reduced|increased|developed|managed|handled|created|built/i.test(params.text)) {
        score += 10;
    }
    score -= Math.min(params.missingSkills.length * 2, 15);
    return Math.max(0, Math.min(100, Math.round(score)));
}
function buildSuggestions(params) {
    const suggestions = [];
    if (params.missingSkills.length > 0) {
        suggestions.push(`Add high-demand skills: ${params.missingSkills.join(", ")}`);
    }
    if (!/github|portfolio|linkedin/i.test(params.text)) {
        suggestions.push("Add LinkedIn, GitHub, portfolio, or professional profile links");
    }
    if (!/achievement|improved|reduced|increased|%|\d+x/i.test(params.text)) {
        suggestions.push("Add measurable achievements and impact numbers");
    }
    if (params.education.length === 0) {
        suggestions.push("Add your education, diploma, degree, or certifications");
    }
    if (params.extractedSkills.length < 5) {
        suggestions.push("Add more skills related to the jobs you want to apply for");
    }
    return suggestions.length
        ? suggestions
        : ["Your CV looks good. Keep it updated with recent experience and projects."];
}
async function analyzeUploadedCv(file) {
    const text = await extractTextFromCv(file);
    const skillKeywords = await getSkillKeywordsFromDatabase();
    const highDemandSkills = await getHighDemandSkillsFromDatabase();
    const extractedSkills = detectSkills(text, skillKeywords);
    const missingSkills = detectMissingSkills(extractedSkills, highDemandSkills);
    const education = detectEducation(text);
    const languages = detectLanguages(text);
    const experienceYears = detectExperienceYears(text);
    const strengthScore = calculateStrengthScore({
        extractedSkills,
        missingSkills,
        education,
        languages,
        experienceYears,
        text,
    });
    const suggestions = buildSuggestions({
        extractedSkills,
        missingSkills,
        education,
        text,
    });
    return {
        strengthScore,
        extractedSkills,
        missingSkills,
        experienceYears,
        education,
        languages,
        suggestions,
    };
}
async function analyzeCvService(userId, data) {
    const candidate = await getCandidateOrFail(userId);
    return (0, cv_repository_1.createCvAnalysisRecord)(candidate.id, data);
}
async function uploadAndAnalyzeCvService(userId, file) {
    const candidate = await getCandidateOrFail(userId);
    const analysis = await analyzeUploadedCv(file);
    return (0, cv_repository_1.createCvAnalysisRecord)(candidate.id, {
        fileName: file.originalname,
        fileUrl: `/uploads/cvs/${file.filename}`,
        ...analysis,
    });
}
async function getMyLatestCvAnalysisService(userId) {
    const candidate = await getCandidateOrFail(userId);
    const analysis = await (0, cv_repository_1.findMyLatestCvAnalysis)(candidate.id);
    if (!analysis) {
        throw new appError_1.AppError("CV_ANALYSIS_NOT_FOUND", "CV analysis not found", 404);
    }
    return analysis;
}
async function getMyCvAnalysesService(userId) {
    const candidate = await getCandidateOrFail(userId);
    const analyses = await (0, cv_repository_1.findMyCvAnalyses)(candidate.id);
    return {
        items: analyses,
        count: analyses.length,
    };
}
//# sourceMappingURL=cv.service.js.map