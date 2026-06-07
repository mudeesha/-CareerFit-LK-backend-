import { Router } from "express";
import {
  getMyProfileController,
  updateMyProfileController,
} from "../controllers/profile.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/me", asyncHandler(getMyProfileController));
router.patch("/me", asyncHandler(updateMyProfileController));

export default router;