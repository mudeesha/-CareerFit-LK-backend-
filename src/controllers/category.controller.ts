import { Request, Response } from "express";
import { getCategoriesService } from "../services/category.service";
import { sendSuccess } from "../utils/apiResponse";

export async function getCategoriesController(_req: Request, res: Response) {
  const data = await getCategoriesService();

  return sendSuccess(res, data);
}