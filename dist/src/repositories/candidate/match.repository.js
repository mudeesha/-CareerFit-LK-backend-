"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateForMatchByUserId = findCandidateForMatchByUserId;
exports.findJobForMatch = findJobForMatch;
const prisma_1 = require("../../lib/prisma");
async function findCandidateForMatchByUserId(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: {
            userId,
        },
    });
}
async function findJobForMatch(jobId) {
    return prisma_1.prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
//# sourceMappingURL=match.repository.js.map