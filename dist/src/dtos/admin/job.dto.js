"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureJobSchema = exports.closeJobSchema = exports.rejectJobSchema = exports.adminJobParamSchema = void 0;
const zod_1 = require("zod");
exports.adminJobParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Job ID is required"),
});
exports.rejectJobSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1, "Reject reason is required").max(1000),
});
exports.closeJobSchema = zod_1.z.object({
    reason: zod_1.z.string().trim().max(1000).optional(),
});
exports.featureJobSchema = zod_1.z.object({
    isFeatured: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=job.dto.js.map