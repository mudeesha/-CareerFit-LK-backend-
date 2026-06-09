import { Router } from "express";
import {
  getMeController,
  loginController,
  registerController,
} from "../../controllers/auth/auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.get("/me", asyncHandler(authenticate), asyncHandler(getMeController));

export default router;