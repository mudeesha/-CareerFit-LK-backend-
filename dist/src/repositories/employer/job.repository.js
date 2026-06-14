"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEmployerByUserId = findEmployerByUserId;
exports.findCategoryById = findCategoryById;
exports.findEmployerJobs = findEmployerJobs;
exports.findEmployerJobById = findEmployerJobById;
exports.createEmployerJobRecord = createEmployerJobRecord;
exports.updateEmployerJobRecord = updateEmployerJobRecord;
exports.closeEmployerJobRecord = closeEmployerJobRecord;
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
async function findCategoryById(categoryId) {
    return prisma_1.prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
}
async function findEmployerJobs(companyId) {
    return prisma_1.prisma.job.findMany({
        where: {
            companyId,
        },
        include: {
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
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
async function createEmployerJobRecord(companyId, data) {
    return prisma_1.prisma.job.create({
        data: {
            companyId,
            categoryId: data.categoryId,
            title: data.title,
            location: data.location,
            workMode: data.workMode,
            jobType: data.jobType,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            experienceLevel: data.experienceLevel,
            skills: data.skills,
            preferredSkills: data.preferredSkills,
            description: data.description,
            responsibilities: data.responsibilities,
            benefits: data.benefits,
            status: data.status,
            postedDate: data.status === client_1.JobStatus.PENDING_APPROVAL ? "Pending review" : undefined,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function updateEmployerJobRecord(jobId, data) {
    return prisma_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            ...data,
            postedDate: data.status === client_1.JobStatus.PENDING_APPROVAL ? "Pending review" : undefined,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
async function closeEmployerJobRecord(jobId) {
    return prisma_1.prisma.job.update({
        where: {
            id: jobId,
        },
        data: {
            status: client_1.JobStatus.CLOSED,
        },
        include: {
            company: true,
            category: true,
        },
    });
}
//# sourceMappingURL=job.repository.js.map