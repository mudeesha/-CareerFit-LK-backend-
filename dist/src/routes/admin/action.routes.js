"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const action_controller_1 = require("../../controllers/admin/action.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(action_controller_1.getAdminActionsController));
exports.default = router;
//# sourceMappingURL=action.routes.js.map