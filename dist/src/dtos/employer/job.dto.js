"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployerJobSchema = exports.createEmployerJobSchema = exports.employerJobParamSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const stringArraySchema = zod_1.z.array(zod_1.z.string().trim().min(1));
exports.employerJobParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Job ID is required"),
});
exports.createEmployerJobSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(2, "Job title is required"),
    categoryId: zod_1.z.string().trim().min(1, "Category is required"),
    location: zod_1.z.string().trim().min(1, "Location is required"),
    workMode: zod_1.z.nativeEnum(client_1.WorkMode),
    jobType: zod_1.z.nativeEnum(client_1.JobType),
    experienceLevel: zod_1.z.nativeEnum(client_1.ExperienceLevel),
    salaryMin: zod_1.z.coerce.number().int().min(0, "Minimum salary is required"),
    salaryMax: zod_1.z.coerce.number().int().min(0, "Maximum salary is required"),
    skills: stringArraySchema.min(1, "At least one skill is required"),
    preferredSkills: stringArraySchema.optional(),
    description: zod_1.z.string().trim().optional(),
    responsibilities: stringArraySchema.optional(),
    benefits: stringArraySchema.optional(),
    status: zod_1.z
        .enum([client_1.JobStatus.DRAFT, client_1.JobStatus.PENDING_APPROVAL])
        .default(client_1.JobStatus.PENDING_APPROVAL),
})
    .refine((data) => data.salaryMin <= data.salaryMax, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["salaryMin"],
});
exports.updateEmployerJobSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(2, "Job title is required").optional(),
    categoryId: zod_1.z.string().trim().min(1, "Category is required").optional(),
    location: zod_1.z.string().trim().min(1, "Location is required").optional(),
    workMode: zod_1.z.nativeEnum(client_1.WorkMode).optional(),
    jobType: zod_1.z.nativeEnum(client_1.JobType).optional(),
    experienceLevel: zod_1.z.nativeEnum(client_1.ExperienceLevel).optional(),
    salaryMin: zod_1.z.coerce.number().int().min(0).optional(),
    salaryMax: zod_1.z.coerce.number().int().min(0).optional(),
    skills: stringArraySchema.min(1, "At least one skill is required").optional(),
    preferredSkills: stringArraySchema.optional(),
    description: zod_1.z.string().trim().optional(),
    responsibilities: stringArraySchema.optional(),
    benefits: stringArraySchema.optional(),
    status: zod_1.z.enum([client_1.JobStatus.DRAFT, client_1.JobStatus.PENDING_APPROVAL]).optional(),
})
    .refine((data) => data.salaryMin === undefined ||
    data.salaryMax === undefined ||
    data.salaryMin <= data.salaryMax, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["salaryMin"],
});
//# sourceMappingURL=job.dto.js.map