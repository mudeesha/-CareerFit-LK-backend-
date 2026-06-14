"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../../controllers/public/job.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(job_controller_1.getJobsController));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(job_controller_1.getJobByIdController));
exports.default = router;
//# sourceMappingURL=job.routes.js.map