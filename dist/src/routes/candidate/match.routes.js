"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const match_controller_1 = require("../../controllers/candidate/match.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/jobs/:id/match", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(match_controller_1.getJobMatchController));
exports.default = router;
//# sourceMappingURL=match.routes.js.map