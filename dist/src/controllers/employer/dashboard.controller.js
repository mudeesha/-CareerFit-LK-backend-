"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerDashboardController = getEmployerDashboardController;
const dashboard_service_1 = require("../../services/employer/dashboard.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUserId(req) {
    const userId = req.user?.id;
    if (!userId) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return userId;
}
async function getEmployerDashboardController(req, res) {
    const userId = getAuthUserId(req);
    const dashboard = await (0, dashboard_service_1.getEmployerDashboardService)(userId);
    return (0, apiResponse_1.sendSuccess)(res, dashboard);
}
//# sourceMappingURL=dashboard.controller.js.map