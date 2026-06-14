"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateForCvByUserId = findCandidateForCvByUserId;
exports.findCvSkillSources = findCvSkillSources;
exports.createCvAnalysisRecord = createCvAnalysisRecord;
exports.findMyLatestCvAnalysis = findMyLatestCvAnalysis;
exports.findMyCvAnalyses = findMyCvAnalyses;
const prisma_1 = require("../../lib/prisma");
async function findCandidateForCvByUserId(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: { userId },
    });
}
async function findCvSkillSources() {
    const [jobs, categories] = await Promise.all([
        prisma_1.prisma.job.findMany({
            where: {
                status: "ACTIVE",
            },
            select: {
                skills: true,
                preferredSkills: true,
            },
        }),
        prisma_1.prisma.category.findMany({
            select: {
                topSkills: true,
            },
        }),
    ]);
    return {
        jobs,
        categories,
    };
}
async function createCvAnalysisRecord(candidateId, data) {
    return prisma_1.prisma.cvAnalysis.create({
        data: {
            candidateId,
            fileName: data.fileName,
            fileUrl: data.fileUrl || `/uploads/${data.fileName}`,
            strengthScore: data.strengthScore ?? 0,
            extractedSkills: data.extractedSkills ?? [],
            missingSkills: data.missingSkills ?? [],
            experienceYears: data.experienceYears ?? 0,
            education: data.education ?? [],
            languages: data.languages ?? [],
            suggestions: data.suggestions ?? [],
        },
    });
}
async function findMyLatestCvAnalysis(candidateId) {
    return prisma_1.prisma.cvAnalysis.findFirst({
        where: { candidateId },
        orderBy: { createdAt: "desc" },
    });
}
async function findMyCvAnalyses(candidateId) {
    return prisma_1.prisma.cvAnalysis.findMany({
        where: { candidateId },
        orderBy: { createdAt: "desc" },
    });
}
//# sourceMappingURL=cv.repository.js.map