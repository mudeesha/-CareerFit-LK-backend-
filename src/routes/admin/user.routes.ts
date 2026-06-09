import { Router } from "express";
import {
  disableUserController,
  enableUserController,
  getAdminUsersController,
} from "../../controllers/admin/user.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(getAdminUsersController)
);

router.patch(
  "/:id/disable",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(disableUserController)
);

router.patch(
  "/:id/enable",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(enableUserController)
);

export default router;