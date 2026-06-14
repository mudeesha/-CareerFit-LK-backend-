"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandidateProfileByUserId = findCandidateProfileByUserId;
exports.findEmployerProfileByUserId = findEmployerProfileByUserId;
exports.updateCandidateProfileByUserId = updateCandidateProfileByUserId;
exports.updateEmployerProfileByUserId = updateEmployerProfileByUserId;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
async function findCandidateProfileByUserId(userId) {
    return prisma_1.prisma.candidateProfile.findUnique({
        where: {
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
        },
    });
}
async function findEmployerProfileByUserId(userId) {
    return prisma_1.prisma.employerProfile.findUnique({
        where: {
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
            company: true,
        },
    });
}
async function updateCandidateProfileByUserId(userId, data) {
    const profile = await findCandidateProfileByUserId(userId);
    if (!profile) {
        return null;
    }
    const nextProfileData = {
        fullName: data.fullName ?? profile.fullName,
        phone: data.phone ?? profile.phone ?? undefined,
        district: data.district ?? profile.district ?? undefined,
        currentRole: data.currentRole ?? profile.currentRole ?? undefined,
        preferredLocations: data.preferredLocations ??
            (profile.preferredLocations === null
                ? client_1.Prisma.JsonNull
                : profile.preferredLocations),
        expectedSalary: data.expectedSalary ?? profile.expectedSalary ?? undefined,
        experienceYears: data.experienceYears ?? profile.experienceYears,
        skills: data.skills ??
            (profile.skills === null ? client_1.Prisma.JsonNull : profile.skills),
        languages: data.languages ??
            (profile.languages === null ? client_1.Prisma.JsonNull : profile.languages),
        education: data.education ?? profile.education ?? undefined,
        linkedinUrl: data.linkedinUrl ?? profile.linkedinUrl ?? undefined,
        githubUrl: data.githubUrl ?? profile.githubUrl ?? undefined,
        portfolioUrl: data.portfolioUrl ?? profile.portfolioUrl ?? undefined,
        profileImageUrl: data.profileImageUrl ?? profile.profileImageUrl ?? undefined,
    };
    return prisma_1.prisma.candidateProfile.update({
        where: {
            userId,
        },
        data: {
            ...nextProfileData,
            profileCompletion: calculateCandidateProfileCompletion(nextProfileData),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
        },
    });
}
async function updateEmployerProfileByUserId(userId, data) {
    const profile = await findEmployerProfileByUserId(userId);
    if (!profile) {
        return null;
    }
    return prisma_1.prisma.employerProfile.update({
        where: {
            userId,
        },
        data: {
            fullName: data.fullName ?? profile.fullName,
            position: data.position ?? profile.position ?? undefined,
            phone: data.phone ?? profile.phone ?? undefined,
            companyId: data.companyId ?? profile.companyId ?? undefined,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
            company: true,
        },
    });
}
function calculateCandidateProfileCompletion(data) {
    const fields = [
        data.fullName,
        data.phone,
        data.district,
        data.currentRole,
        Array.isArray(data.preferredLocations)
            ? data.preferredLocations.length
            : undefined,
        data.expectedSalary,
        data.experienceYears,
        Array.isArray(data.skills) ? data.skills.length : undefined,
        Array.isArray(data.languages) ? data.languages.length : undefined,
        data.education,
        data.linkedinUrl,
        data.githubUrl,
        data.portfolioUrl,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
}
//# sourceMappingURL=profile.repository.js.map