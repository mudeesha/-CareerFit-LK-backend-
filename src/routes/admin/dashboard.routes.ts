import { Router } from "express";
import { getAdminDashboardController } from "../../controllers/admin/dashboard.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(getAdminDashboardController)
);

export default router;