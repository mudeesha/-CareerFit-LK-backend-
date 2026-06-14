"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUserWithProfile = createUserWithProfile;
const prisma_1 = require("../../lib/prisma");
async function findUserByEmail(email) {
    return prisma_1.prisma.user.findUnique({
        where: { email },
        include: {
            candidateProfile: true,
            employerProfile: true,
        },
    });
}
async function findUserById(id) {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        include: {
            candidateProfile: true,
            employerProfile: true,
        },
    });
}
async function createUserWithProfile(data) {
    return prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            role: data.role,
            candidateProfile: data.role === "CANDIDATE"
                ? {
                    create: {
                        fullName: data.fullName,
                        phone: data.phone,
                        district: data.district,
                        profileCompletion: 20,
                        skills: [],
                        languages: [],
                        preferredLocations: [],
                    },
                }
                : undefined,
            employerProfile: data.role === "EMPLOYER"
                ? {
                    create: {
                        fullName: data.fullName,
                        phone: data.phone,
                        position: data.position,
                    },
                }
                : undefined,
        },
        include: {
            candidateProfile: true,
            employerProfile: true,
        },
    });
}
//# sourceMappingURL=auth.repository.js.map