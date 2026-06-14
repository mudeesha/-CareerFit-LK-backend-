"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCvSchema = void 0;
const zod_1 = require("zod");
exports.analyzeCvSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1, "File name is required"),
    fileUrl: zod_1.z.string().optional(),
    strengthScore: zod_1.z.number().int().min(0).max(100).optional(),
    extractedSkills: zod_1.z.array(zod_1.z.string()).optional(),
    missingSkills: zod_1.z.array(zod_1.z.string()).optional(),
    experienceYears: zod_1.z.number().min(0).optional(),
    education: zod_1.z.array(zod_1.z.string()).optional(),
    languages: zod_1.z.array(zod_1.z.string()).optional(),
    suggestions: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=cv.dto.js.map