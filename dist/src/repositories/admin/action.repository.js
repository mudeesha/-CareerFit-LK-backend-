"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAdminActions = findAdminActions;
const prisma_1 = require("../../lib/prisma");
async function findAdminActions(filters) {
    const where = {};
    if (filters.entityType) {
        where.entityType = filters.entityType;
    }
    if (filters.action) {
        where.action = filters.action;
    }
    if (filters.entityId) {
        where.entityId = filters.entityId;
    }
    if (filters.companyId) {
        where.companyId = filters.companyId;
    }
    if (filters.jobId) {
        where.jobId = filters.jobId;
    }
    return prisma_1.prisma.adminAction.findMany({
        where,
        include: {
            company: true,
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: filters.limit,
    });
}
//# sourceMappingURL=action.repository.js.map