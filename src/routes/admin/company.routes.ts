import { Router } from "express";
import {
  approveCompanyController,
  getPendingCompaniesController,
  rejectCompanyController,
  suspendCompanyController,
} from "../../controllers/admin/company.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/pending",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(getPendingCompaniesController)
);

router.patch(
  "/:id/approve",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(approveCompanyController)
);

router.patch(
  "/:id/reject",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(rejectCompanyController)
);

router.patch(
  "/:id/suspend",
  asyncHandler(authenticate),
  authorizeRoles("ADMIN"),
  asyncHandler(suspendCompanyController)
);

export default router;