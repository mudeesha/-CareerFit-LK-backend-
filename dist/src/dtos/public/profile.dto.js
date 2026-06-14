"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployerProfileSchema = exports.updateCandidateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateCandidateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    currentRole: zod_1.z.string().optional(),
    preferredLocations: zod_1.z.array(zod_1.z.string()).optional(),
    expectedSalary: zod_1.z.number().int().positive().optional(),
    experienceYears: zod_1.z.number().min(0).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    languages: zod_1.z.array(zod_1.z.string()).optional(),
    education: zod_1.z.string().optional(),
    linkedinUrl: zod_1.z.string().optional(),
    githubUrl: zod_1.z.string().optional(),
    portfolioUrl: zod_1.z.string().optional(),
    profileImageUrl: zod_1.z.string().optional(),
});
exports.updateEmployerProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).optional(),
    position: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    companyId: zod_1.z.string().optional(),
});
//# sourceMappingURL=profile.dto.js.map