"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminUsersService = getAdminUsersService;
exports.disableUserService = disableUserService;
exports.enableUserService = enableUserService;
const client_1 = require("@prisma/client");
const user_repository_1 = require("../../repositories/admin/user.repository");
const appError_1 = require("../../utils/appError");
async function getUserOrFail(userId) {
    const user = await (0, user_repository_1.findUserForAdminById)(userId);
    if (!user) {
        throw new appError_1.AppError("USER_NOT_FOUND", "User not found", 404);
    }
    return user;
}
async function getAdminUsersService(filters) {
    const users = await (0, user_repository_1.findAdminUsers)(filters);
    return {
        items: users,
        count: users.length,
    };
}
async function disableUserService(adminUserId, targetUserId) {
    const user = await getUserOrFail(targetUserId);
    if (user.id === adminUserId) {
        throw new appError_1.AppError("CANNOT_DISABLE_SELF", "You cannot disable your own account", 400);
    }
    if (user.role === client_1.UserRole.ADMIN) {
        throw new appError_1.AppError("CANNOT_DISABLE_ADMIN", "Admin users cannot be disabled from this endpoint", 400);
    }
    if (user.status === client_1.UserStatus.DISABLED) {
        throw new appError_1.AppError("USER_ALREADY_DISABLED", "User is already disabled", 400);
    }
    return (0, user_repository_1.updateUserStatusRecord)(user.id, client_1.UserStatus.DISABLED);
}
async function enableUserService(adminUserId, targetUserId) {
    const user = await getUserOrFail(targetUserId);
    if (user.id === adminUserId) {
        throw new appError_1.AppError("CANNOT_ENABLE_SELF", "You cannot enable your own account from this endpoint", 400);
    }
    if (user.status === client_1.UserStatus.ACTIVE) {
        throw new appError_1.AppError("USER_ALREADY_ACTIVE", "User is already active", 400);
    }
    return (0, user_repository_1.updateUserStatusRecord)(user.id, client_1.UserStatus.ACTIVE);
}
//# sourceMappingURL=user.service.js.map