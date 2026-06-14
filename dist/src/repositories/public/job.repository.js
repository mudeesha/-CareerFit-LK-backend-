"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findJobs = findJobs;
exports.findJobById = findJobById;
const prisma_1 = require("../../lib/prisma");
async function findJobs(filters) {
    const where = {
        status: "ACTIVE",
    };
    if (filters.category) {
        where.category = {
            name: filters.category,
        };
    }
    if (filters.company) {
        where.company = {
            name: filters.company,
        };
    }
    if (filters.location) {
        where.location = filters.location;
    }
    if (filters.workMode) {
        where.workMode = filters.workMode;
    }
    if (filters.jobType) {
        where.jobType = filters.jobType;
    }
    if (filters.experienceLevel) {
        where.experienceLevel = filters.experienceLevel;
    }
    if (filters.salaryMin) {
        where.salaryMax = {
            gte: filters.salaryMin,
        };
    }
    if (filters.salaryMax) {
        where.salaryMin = {
            lte: filters.salaryMax,
        };
    }
    if (filters.keyword) {
        where.OR = [
            {
                title: {
                    contains: filters.keyword,
                },
            },
            {
                company: {
                    name: {
                        contains: filters.keyword,
                    },
                },
            },
        ];
    }
    return prisma_1.prisma.job.findMany({
        where,
        include: {
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function findJobById(id) {
    return prisma_1.prisma.job.findUnique({
        where: {
            id,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
//# sourceMappingURL=job.repository.js.map