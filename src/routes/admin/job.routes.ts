import { Router } from "express";
import {
  approveJobController,
  closeJobController,
  featureJobController,
  getPendingJobsController,
  rejectJobController,
} from "../../controllers/admin/job.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/pending",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(getPendingJobsController)
);

router.patch(
  "/:id/approve",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(approveJobController)
);

router.patch(
  "/:id/reject",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(rejectJobController)
);

router.patch(
  "/:id/feature",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(featureJobController)
);

router.patch(
  "/:id/close",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(closeJobController)
);

export default router;