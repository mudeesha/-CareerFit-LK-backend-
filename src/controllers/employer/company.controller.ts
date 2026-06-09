import { Request, Response } from "express";
import { updateEmployerCompanySchema } from "../../dtos/employer/company.dto";
import {
  getEmployerCompanyService,
  updateEmployerCompanyService,
} from "../../services/employer/company.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function getEmployerCompanyController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);

  const company = await getEmployerCompanyService(userId);

  return sendSuccess(res, company);
}

export async function updateEmployerCompanyController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);
  const data = updateEmployerCompanySchema.parse(req.body);

  const company = await updateEmployerCompanyService(userId, data);

  return sendSuccess(res, company, "Company profile updated successfully");
}