import { Router } from "express";
import { getJobMatchController } from "../controllers/match.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/jobs/:id/match", asyncHandler(getJobMatchController));

export default router;