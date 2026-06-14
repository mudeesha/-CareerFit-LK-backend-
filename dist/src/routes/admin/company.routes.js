"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../../controllers/admin/company.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/pending", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(company_controller_1.getPendingCompaniesController));
router.patch("/:id/approve", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(company_controller_1.approveCompanyController));
router.patch("/:id/reject", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(company_controller_1.rejectCompanyController));
router.patch("/:id/suspend", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(company_controller_1.suspendCompanyController));
exports.default = router;
//# sourceMappingURL=company.routes.js.map