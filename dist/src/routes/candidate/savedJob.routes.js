"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savedJob_controller_1 = require("../../controllers/candidate/savedJob.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/:jobId", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(savedJob_controller_1.saveJobController));
router.get("/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(savedJob_controller_1.getMySavedJobsController));
router.delete("/:jobId", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(savedJob_controller_1.removeSavedJobController));
exports.default = router;
//# sourceMappingURL=savedJob.routes.js.map