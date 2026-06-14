"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminUsersQuerySchema = exports.adminUserParamSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.adminUserParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "User ID is required"),
});
exports.getAdminUsersQuerySchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(client_1.UserRole).optional(),
    status: zod_1.z.nativeEnum(client_1.UserStatus).optional(),
    keyword: zod_1.z.string().trim().optional(),
});
//# sourceMappingURL=user.dto.js.map