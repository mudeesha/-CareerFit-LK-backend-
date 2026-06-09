import { Router } from "express";
import {
  getCompaniesController,
  getCompanyByIdController,
} from "../../controllers/public/company.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getCompaniesController));
router.get("/:id", asyncHandler(getCompanyByIdController));

export default router;