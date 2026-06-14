"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedJobParamSchema = void 0;
const zod_1 = require("zod");
exports.savedJobParamSchema = zod_1.z.object({
    jobId: zod_1.z.string().trim().min(1, "Job ID is required"),
});
//# sourceMappingURL=savedJob.dto.js.map