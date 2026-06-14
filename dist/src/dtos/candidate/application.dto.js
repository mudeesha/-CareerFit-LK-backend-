"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationIdParamSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
exports.createApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.string().trim().min(1, "Job ID is required"),
    coverLetter: zod_1.z
        .string()
        .trim()
        .min(10, "Cover letter must be at least 10 characters")
        .max(2000, "Cover letter must be less than 2000 characters"),
});
exports.applicationIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Application ID is required"),
});
//# sourceMappingURL=application.dto.js.map