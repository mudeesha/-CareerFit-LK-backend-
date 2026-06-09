import { Router } from "express";
import {
  getJobByIdController,
  getJobsController,
} from "../../controllers/public/job.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getJobsController));
router.get("/:id", asyncHandler(getJobByIdController));

export default router;