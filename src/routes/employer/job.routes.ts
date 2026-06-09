import { Router } from "express";
import {
  closeEmployerJobController,
  createEmployerJobController,
  getEmployerJobByIdController,
  getEmployerJobsController,
  updateEmployerJobController,
} from "../../controllers/employer/job.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(getEmployerJobsController)
);

router.post(
  "/",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(createEmployerJobController)
);

router.get(
  "/:id",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(getEmployerJobByIdController)
);

router.patch(
  "/:id",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(updateEmployerJobController)
);

router.patch(
  "/:id/close",
  asyncHandler(authenticate),
  authorizeRoles("EMPLOYER"),
  asyncHandler(closeEmployerJobController)
);

export default router;