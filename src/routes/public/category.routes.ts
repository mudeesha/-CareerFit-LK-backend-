import { Router } from "express";
import { getCategoriesController } from "../../controllers/public/category.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getCategoriesController));

export default router;