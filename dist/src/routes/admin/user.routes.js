"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/admin/user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(user_controller_1.getAdminUsersController));
router.patch("/:id/disable", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(user_controller_1.disableUserController));
router.patch("/:id/enable", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(user_controller_1.enableUserController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map