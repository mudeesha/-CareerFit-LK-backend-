import { Router } from "express";
import { getJobMatchController } from "../../controllers/candidate/match.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/jobs/:id/match",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getJobMatchController)
);

export default router;