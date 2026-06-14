import { Router } from "express";
import {
  getJobByIdController,
  getJobsController,
} from "../../controllers/public/job.controller";
import { optionalAuthenticate } from "../../middlewares/optionalAuth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", optionalAuthenticate, asyncHandler(getJobsController));
router.get("/:id", optionalAuthenticate, asyncHandler(getJobByIdController));

export default router;