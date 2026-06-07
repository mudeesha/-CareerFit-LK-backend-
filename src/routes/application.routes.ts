import { Router } from "express";
import {
  createApplicationController,
  getMyApplicationsController,
  withdrawApplicationController,
} from "../controllers/application.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(createApplicationController)
);

router.get(
  "/me",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getMyApplicationsController)
);

router.patch(
  "/:id/withdraw",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(withdrawApplicationController)
);

export default router;