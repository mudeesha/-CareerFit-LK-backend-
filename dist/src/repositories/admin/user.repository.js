"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAdminUsers = findAdminUsers;
exports.findUserForAdminById = findUserForAdminById;
exports.updateUserStatusRecord = updateUserStatusRecord;
const prisma_1 = require("../../lib/prisma");
async function findAdminUsers(filters) {
    const where = {};
    if (filters.role) {
        where.role = filters.role;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.keyword) {
        where.OR = [
            {
                email: {
                    contains: filters.keyword,
                },
            },
            {
                candidateProfile: {
                    fullName: {
                        contains: filters.keyword,
                    },
                },
            },
            {
                employerProfile: {
                    fullName: {
                        contains: filters.keyword,
                    },
                },
            },
            {
                employerProfile: {
                    company: {
                        name: {
                            contains: filters.keyword,
                        },
                    },
                },
            },
        ];
    }
    return prisma_1.prisma.user.findMany({
        where,
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            candidateProfile: true,
            employerProfile: {
                include: {
                    company: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function findUserForAdminById(userId) {
    return prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            candidateProfile: true,
            employerProfile: {
                include: {
                    company: true,
                },
            },
        },
    });
}
async function updateUserStatusRecord(userId, status) {
    return prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            candidateProfile: true,
            employerProfile: {
                include: {
                    company: true,
                },
            },
        },
    });
}
//# sourceMappingURL=user.repository.js.map