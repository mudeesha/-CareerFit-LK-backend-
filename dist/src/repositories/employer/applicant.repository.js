"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployerByUserId = findEmployerByUserId;
exports.findEmployerJobById = findEmployerJobById;
exports.findApplicantsByJobId = findApplicantsByJobId;
exports.findApplicationForEmployer = findApplicationForEmployer;
exports.updateApplicationStatusRecord = updateApplicationStatusRecord;
const prisma_1 = require("../../lib/prisma");
async function findEmployerByUserId(userId) {
    return prisma_1.prisma.employerProfile.findUnique({
        where: {
            userId,
        },
        include: {
            company: true,
        },
    });
}
async function findEmployerJobById(companyId, jobId) {
    return prisma_1.prisma.job.findFirst({
        where: {
            id: jobId,
            companyId,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function findApplicantsByJobId(jobId) {
    return prisma_1.prisma.application.findMany({
        where: {
            jobId,
        },
        include: {
            candidate: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    cvAnalyses: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
            },
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
            interview: true,
        },
        orderBy: {
            appliedAt: "desc",
        },
    });
}
async function findApplicationForEmployer(companyId, applicationId) {
    return prisma_1.prisma.application.findFirst({
        where: {
            id: applicationId,
            job: {
                companyId,
            },
        },
        include: {
            candidate: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    cvAnalyses: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
            },
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
            interview: true,
        },
    });
}
async function updateApplicationStatusRecord(applicationId, status) {
    return prisma_1.prisma.application.update({
        where: {
            id: applicationId,
        },
        data: {
            status,
        },
        include: {
            candidate: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    cvAnalyses: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
            },
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
            interview: true,
        },
    });
}
//# sourceMappingURL=applicant.repository.js.map