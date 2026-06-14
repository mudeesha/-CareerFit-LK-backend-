"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../../controllers/employer/dashboard.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getEmployerDashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map