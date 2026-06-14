"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobIdParamSchema = exports.getJobsQuerySchema = void 0;
const zod_1 = require("zod");
exports.getJobsQuerySchema = zod_1.z.object({
    keyword: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    workMode: zod_1.z.string().optional(),
    jobType: zod_1.z.string().optional(),
    experienceLevel: zod_1.z.string().optional(),
    salaryMin: zod_1.z.coerce.number().optional(),
    salaryMax: zod_1.z.coerce.number().optional(),
});
exports.jobIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Job ID is required"),
});
//# sourceMappingURL=job.dto.js.map