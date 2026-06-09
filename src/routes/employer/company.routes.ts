import { Router } from "express";
import {
  getEmployerCompanyController,
  updateEmployerCompanyController,
} from "../../controllers/employer/company.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(getEmployerCompanyController)
);

router.patch(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(updateEmployerCompanyController)
);

export default router;