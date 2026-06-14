"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminActionsController = getAdminActionsController;
const action_dto_1 = require("../../dtos/admin/action.dto");
const action_service_1 = require("../../services/admin/action.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function getAdminActionsController(req, res) {
    getAuthUserId(req);
    const filters = action_dto_1.getAdminActionsQuerySchema.parse(req.query);
    const data = await (0, action_service_1.getAdminActionsService)(filters);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
//# sourceMappingURL=action.controller.js.map