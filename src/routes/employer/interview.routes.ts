import { Router } from "express";
import {
  cancelInterviewController,
  scheduleInterviewController,
  updateInterviewController,
} from "../../controllers/employer/interview.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/applications/:id/interview",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(scheduleInterviewController)
);

router.patch(
  "/interviews/:id",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(updateInterviewController)
);

router.patch(
  "/interviews/:id/cancel",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(cancelInterviewController)
);

export default router;