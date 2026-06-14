"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminActionsQuerySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.getAdminActionsQuerySchema = zod_1.z.object({
    entityType: zod_1.z.nativeEnum(client_1.AdminEntityType).optional(),
    action: zod_1.z.nativeEnum(client_1.AdminActionType).optional(),
    entityId: zod_1.z.string().trim().optional(),
    companyId: zod_1.z.string().trim().optional(),
    jobId: zod_1.z.string().trim().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
//# sourceMappingURL=action.dto.js.map