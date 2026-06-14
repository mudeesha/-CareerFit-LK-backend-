"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectApplicationSchema = exports.employerApplicationParamSchema = exports.employerJobApplicantParamSchema = void 0;
const zod_1 = require("zod");
exports.employerJobApplicantParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Job ID is required"),
});
exports.employerApplicationParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Application ID is required"),
});
exports.rejectApplicationSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().max(1000).optional(),
});
//# sourceMappingURL=applicant.dto.js.map