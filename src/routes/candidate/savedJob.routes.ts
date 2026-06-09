import { Router } from "express";
import {
  getMySavedJobsController,
  removeSavedJobController,
  saveJobController,
} from "../../controllers/candidate/savedJob.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/:jobId",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(saveJobController)
);

router.get(
  "/me",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getMySavedJobsController)
);

router.delete(
  "/:jobId",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(removeSavedJobController)
);

export default router;