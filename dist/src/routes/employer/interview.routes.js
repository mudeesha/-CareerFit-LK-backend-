"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interview_controller_1 = require("../../controllers/employer/interview.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/applications/:id/interview", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(interview_controller_1.scheduleInterviewController));
router.patch("/interviews/:id", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(interview_controller_1.updateInterviewController));
router.patch("/interviews/:id/cancel", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(interview_controller_1.cancelInterviewController));
exports.default = router;
//# sourceMappingURL=interview.routes.js.map