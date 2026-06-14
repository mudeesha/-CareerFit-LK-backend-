"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployerByUserId = findEmployerByUserId;
exports.findApplicationForEmployer = findApplicationForEmployer;
exports.findInterviewForEmployer = findInterviewForEmployer;
exports.createInterviewRecord = createInterviewRecord;
exports.updateApplicationStatusToInterviewScheduled = updateApplicationStatusToInterviewScheduled;
exports.updateInterviewRecord = updateInterviewRecord;
exports.cancelInterviewRecord = cancelInterviewRecord;
const client_1 = require("@prisma/client");
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
async function findInterviewForEmployer(companyId, interviewId) {
    return prisma_1.prisma.interview.findFirst({
        where: {
            id: interviewId,
            application: {
                job: {
                    companyId,
                },
            },
        },
        include: {
            application: {
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
                },
            },
        },
    });
}
async function createInterviewRecord(applicationId, data) {
    return prisma_1.prisma.interview.create({
        data: {
            applicationId,
            interviewDate: data.interviewDate,
            interviewTime: data.interviewTime,
            interviewType: data.interviewType,
            locationOrLink: data.locationOrLink,
            notes: data.notes,
            status: client_1.InterviewStatus.SCHEDULED,
        },
        include: {
            application: {
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
                },
            },
        },
    });
}
async function updateApplicationStatusToInterviewScheduled(applicationId) {
    return prisma_1.prisma.application.update({
        where: {
            id: applicationId,
        },
        data: {
            status: client_1.ApplicationStatus.INTERVIEW_SCHEDULED,
        },
    });
}
async function updateInterviewRecord(interviewId, data) {
    return prisma_1.prisma.interview.update({
        where: {
            id: interviewId,
        },
        data,
        include: {
            application: {
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
                },
            },
        },
    });
}
async function cancelInterviewRecord(interviewId) {
    return prisma_1.prisma.interview.update({
        where: {
            id: interviewId,
        },
        data: {
            status: client_1.InterviewStatus.CANCELLED,
        },
        include: {
            application: {
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
                },
            },
        },
    });
}
//# sourceMappingURL=interview.repository.js.map