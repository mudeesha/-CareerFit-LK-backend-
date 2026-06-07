import { Router } from "express";
import {
  createApplicationController,
  getMyApplicationsController,
  withdrawApplicationController,
} from "../controllers/application.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createApplicationController));
router.get("/me", asyncHandler(getMyApplicationsController));
router.patch("/:id/withdraw", asyncHandler(withdrawApplicationController));

export default router;