import { Router } from "express";
import {
  getMyCvAnalysesController,
  getMyLatestCvAnalysisController,
  uploadAndAnalyzeCvController,
} from "../../controllers/candidate/cv.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { uploadCv } from "../../middlewares/uploadCv";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/upload",
  asyncHandler(authenticate),
  uploadCv.single("cv"),
  asyncHandler(uploadAndAnalyzeCvController)
);

router.get(
  "/analysis/me",
  asyncHandler(authenticate),
  asyncHandler(getMyLatestCvAnalysisController)
);

router.get(
  "/analyses/me",
  asyncHandler(authenticate),
  asyncHandler(getMyCvAnalysesController)
);

export default router;