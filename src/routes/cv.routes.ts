import { Router } from "express";
import {
  analyzeCvController,
  getMyCvAnalysesController,
  getMyLatestCvAnalysisController,
  uploadAndAnalyzeCvController,
} from "../controllers/cv.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadCv } from "../middlewares/uploadCv";

const router = Router();

router.post("/analyze", asyncHandler(analyzeCvController));

router.post(
  "/upload",
  uploadCv.single("cv"),
  asyncHandler(uploadAndAnalyzeCvController)
);

router.get("/analysis/me", asyncHandler(getMyLatestCvAnalysisController));
router.get("/analyses/me", asyncHandler(getMyCvAnalysesController));

export default router;