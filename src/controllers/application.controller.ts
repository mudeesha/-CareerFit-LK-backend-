import { Request, Response } from "express";
import { createApplicationSchema } from "../dtos/application.dto";
import {
  createApplicationService,
  getMyApplicationsService,
  withdrawApplicationService,
} from "../services/application.service";
import { sendSuccess } from "../utils/apiResponse";

export async function createApplicationController(req: Request, res: Response) {
  const data = createApplicationSchema.parse(req.body);

  const application = await createApplicationService(data);

  return sendSuccess(
    res,
    application,
    "Application submitted successfully",
    201
  );
}

export async function getMyApplicationsController(_req: Request, res: Response) {
  const applications = await getMyApplicationsService();

  return sendSuccess(res, {
    items: applications,
    count: applications.length,
  });
}

export async function withdrawApplicationController(req: Request, res: Response) {
  const application = await withdrawApplicationService(req.params.id);

  return sendSuccess(res, application, "Application withdrawn successfully");
}