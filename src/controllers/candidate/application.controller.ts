import { Request, Response } from "express";
import {
  applicationIdParamSchema,
  createApplicationSchema,
} from "../../dtos/candidate/application.dto";
import {
  createApplicationService,
  getMyApplicationsService,
  withdrawApplicationService,
} from "../../services/candidate/application.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function createApplicationController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const data = createApplicationSchema.parse(req.body);

  const application = await createApplicationService(userId, data);

  return sendSuccess(
    res,
    application,
    "Application submitted successfully",
    201
  );
}

export async function getMyApplicationsController(req: Request, res: Response) {
  const userId = getAuthUserId(req);

  const applications = await getMyApplicationsService(userId);

  return sendSuccess(res, {
    items: applications,
    count: applications.length,
  });
}

export async function withdrawApplicationController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const { id: applicationId } = applicationIdParamSchema.parse(req.params);

  const application = await withdrawApplicationService(userId, applicationId);

  return sendSuccess(res, application, "Application withdrawn successfully");
}