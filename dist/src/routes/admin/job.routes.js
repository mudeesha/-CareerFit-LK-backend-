"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../../controllers/admin/job.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/pending", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(job_controller_1.getPendingJobsController));
router.patch("/:id/approve", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(job_controller_1.approveJobController));
router.patch("/:id/reject", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(job_controller_1.rejectJobController));
router.patch("/:id/feature", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(job_controller_1.featureJobController));
router.patch("/:id/close", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("ADMIN"), (0, asyncHandler_1.asyncHandler)(job_controller_1.closeJobController));
exports.default = router;
//# sourceMappingURL=job.routes.js.map