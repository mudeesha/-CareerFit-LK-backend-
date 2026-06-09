import { Router } from "express";
import {
  getEmployerJobApplicantsController,
  hireApplicationController,
  markApplicationViewedController,
  rejectApplicationController,
  shortlistApplicationController,
} from "../../controllers/employer/applicant.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/jobs/:id/applicants",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(getEmployerJobApplicantsController)
);

router.patch(
  "/applications/:id/viewed",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(markApplicationViewedController)
);

router.patch(
  "/applications/:id/shortlist",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(shortlistApplicationController)
);

router.patch(
  "/applications/:id/reject",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(rejectApplicationController)
);

router.patch(
  "/applications/:id/hire",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(hireApplicationController)
);

export default router;