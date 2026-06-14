"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspendCompanySchema = exports.rejectCompanySchema = exports.adminCompanyParamSchema = void 0;
const zod_1 = require("zod");
exports.adminCompanyParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Company ID is required"),
});
exports.rejectCompanySchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1, "Reject reason is required").max(1000),
});
exports.suspendCompanySchema = zod_1.z.object({
    reason: zod_1.z.string().trim().min(1, "Suspend reason is required").max(1000),
});
//# sourceMappingURL=company.dto.js.map