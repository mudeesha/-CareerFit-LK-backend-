import { Router } from "express";
import { getAdminActionsController } from "../../controllers/admin/action.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(getAdminActionsController)
);

export default router;