import { Router } from "express";
import {
  analyzeCvController,
  getMyCvAnalysesController,
  getMyLatestCvAnalysisController,
} from "../controllers/cv.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/analyze", asyncHandler(analyzeCvController));
router.get("/analysis/me", asyncHandler(getMyLatestCvAnalysisController));
router.get("/analyses/me", asyncHandler(getMyCvAnalysesController));

export default router;