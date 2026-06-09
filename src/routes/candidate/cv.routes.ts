import { Router } from "express";
import {
  analyzeCvController,
  getMyCvAnalysesController,
  getMyLatestCvAnalysisController,
  uploadAndAnalyzeCvController,
} from "../../controllers/candidate/cv.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { uploadCv } from "../../middlewares/uploadCv";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/analyze",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(analyzeCvController)
);

router.post(
  "/upload",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  uploadCv.single("cv"),
  asyncHandler(uploadAndAnalyzeCvController)
);

router.get(
  "/analysis/me",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getMyLatestCvAnalysisController)
);

router.get(
  "/analyses/me",
  asyncHandler(authenticate),
  authorizeRoles("CANDIDATE"),
  asyncHandler(getMyCvAnalysesController)
);

export default router;