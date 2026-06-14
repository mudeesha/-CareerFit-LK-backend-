import { Router } from "express";
import {
  getMyProfileController,
  updateMyProfileController,
} from "../../controllers/public/profile.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadMyProfileAvatarController } from "../../controllers/public/profile.controller";
import { uploadProfileImage } from "../../middlewares/uploadProfileImage";

const router = Router();

router.get("/me", asyncHandler(authenticate), asyncHandler(getMyProfileController));

router.patch(
  "/me",
  asyncHandler(authenticate),
  asyncHandler(updateMyProfileController)
);

router.post(
  "/me/avatar",
  asyncHandler(authenticate),
  uploadProfileImage.single("avatar"),
  asyncHandler(uploadMyProfileAvatarController)
);

export default router;