"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.asyncHandler)(auth_controller_1.registerController));
router.post("/login", (0, asyncHandler_1.asyncHandler)(auth_controller_1.loginController));
router.get("/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, asyncHandler_1.asyncHandler)(auth_controller_1.getMeController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map