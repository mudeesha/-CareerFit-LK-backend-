"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPendingCompanies = findPendingCompanies;
exports.findCompanyById = findCompanyById;
exports.updateCompanyStatusRecord = updateCompanyStatusRecord;
exports.createCompanyAdminActionRecord = createCompanyAdminActionRecord;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findPendingCompanies() {
    return prisma_1.prisma.company.findMany({
        where: {
            status: client_1.CompanyStatus.PENDING,
        },
        include: {
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
            jobs: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function findCompanyById(companyId) {
    return prisma_1.prisma.company.findUnique({
        where: {
            id: companyId,
        },
        include: {
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
            jobs: {
                include: {
                    category: true,
                },
            },
        },
    });
}
async function updateCompanyStatusRecord(companyId, status) {
    return prisma_1.prisma.company.update({
        where: {
            id: companyId,
        },
        data: {
            status,
        },
        include: {
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
            jobs: {
                include: {
                    category: true,
                },
            },
        },
    });
}
async function createCompanyAdminActionRecord(data) {
    return prisma_1.prisma.adminAction.create({
        data: {
            adminUserId: data.adminUserId,
            entityType: client_1.AdminEntityType.COMPANY,
            entityId: data.companyId,
            action: data.action,
            reason: data.reason,
            companyId: data.companyId,
        },
    });
}
//# sourceMappingURL=company.repository.js.map