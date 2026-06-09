import { Request, Response } from "express";
import {
  getCompaniesService,
  getCompanyByIdService,
} from "../../services/public/company.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function getCompaniesController(_req: Request, res: Response) {
  const data = await getCompaniesService();

  return sendSuccess(res, data);
}

export async function getCompanyByIdController(req: Request, res: Response) {
  const company = await getCompanyByIdService(req.params.id);

  return sendSuccess(res, company);
}