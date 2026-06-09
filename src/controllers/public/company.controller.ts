import { Request, Response } from "express";
import { companyIdParamSchema } from "../../dtos/public/company.dto";
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
  const { id } = companyIdParamSchema.parse(req.params);

  const company = await getCompanyByIdService(id);

  return sendSuccess(res, company);
}