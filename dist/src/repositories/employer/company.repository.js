"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployerByUserId = findEmployerByUserId;
exports.findEmployerCompanyById = findEmployerCompanyById;
exports.updateEmployerCompanyRecord = updateEmployerCompanyRecord;
const prisma_1 = require("../../lib/prisma");
async function findEmployerByUserId(userId) {
    return prisma_1.prisma.employerProfile.findUnique({
        where: {
            userId,
        },
        include: {
            company: {
                include: {
                    jobs: {
                        include: {
                            category: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    employers: {
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
                        },
                    },
                },
            },
        },
    });
}
async function findEmployerCompanyById(companyId) {
    return prisma_1.prisma.company.findUnique({
        where: {
            id: companyId,
        },
        include: {
            jobs: {
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            employers: {
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
                },
            },
        },
    });
}
async function updateEmployerCompanyRecord(companyId, data) {
    return prisma_1.prisma.company.update({
        where: {
            id: companyId,
        },
        data,
        include: {
            jobs: {
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            employers: {
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
                },
            },
        },
    });
}
//# sourceMappingURL=company.repository.js.map