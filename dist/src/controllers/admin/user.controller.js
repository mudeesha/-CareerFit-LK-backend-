"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminUsersController = getAdminUsersController;
exports.disableUserController = disableUserController;
exports.enableUserController = enableUserController;
const user_dto_1 = require("../../dtos/admin/user.dto");
const user_service_1 = require("../../services/admin/user.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
function getUserIdParam(req) {
    const { id } = user_dto_1.adminUserParamSchema.parse(req.params);
    return id;
}
async function getAdminUsersController(req, res) {
    getAuthUserId(req);
    const filters = user_dto_1.getAdminUsersQuerySchema.parse(req.query);
    const data = await (0, user_service_1.getAdminUsersService)(filters);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function disableUserController(req, res) {
    const adminUserId = getAuthUserId(req);
    const targetUserId = getUserIdParam(req);
    const user = await (0, user_service_1.disableUserService)(adminUserId, targetUserId);
    return (0, apiResponse_1.sendSuccess)(res, user, "User disabled successfully");
}
async function enableUserController(req, res) {
    const adminUserId = getAuthUserId(req);
    const targetUserId = getUserIdParam(req);
    const user = await (0, user_service_1.enableUserService)(adminUserId, targetUserId);
    return (0, apiResponse_1.sendSuccess)(res, user, "User enabled successfully");
}
//# sourceMappingURL=user.controller.js.map