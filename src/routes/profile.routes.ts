import { Router } from "express";
import {
  getMyProfileController,
  updateMyProfileController,
} from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(getMyProfileController));

router.patch(
  "/me",
  asyncHandler(authenticate),
  asyncHandler(updateMyProfileController)
);

export default router;