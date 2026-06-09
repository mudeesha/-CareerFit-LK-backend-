import { Router } from "express";
import { getCandidateDashboardController } from "../../controllers/candidate/dashboard.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getCandidateDashboardController)
);

export default router;