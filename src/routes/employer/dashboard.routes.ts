import { Router } from "express";
import { getEmployerDashboardController } from "../../controllers/employer/dashboard.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(getEmployerDashboardController)
);

export default router;