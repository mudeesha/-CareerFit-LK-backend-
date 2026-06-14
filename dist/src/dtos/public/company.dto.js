"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyIdParamSchema = void 0;
const zod_1 = require("zod");
exports.companyIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Company ID is required"),
});
//# sourceMappingURL=company.dto.js.map