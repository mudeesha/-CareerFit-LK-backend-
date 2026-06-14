import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../../dtos/auth/auth.dto";
import {
  getMeService,
  loginService,
  registerService,
} from "../../services/auth/auth.service";
import { AppError } from "../../utils/appError";
import { sendSuccess } from "../../utils/apiResponse";

export async function registerController(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const result = await registerService(data);

  return sendSuccess(res, result, "Registration successful", 201);
}

export async function loginController(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const result = await loginService(data);

  return sendSuccess(res, result, "Login successful");
}

export async function getMeController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  const user = await getMeService(req.user.id);

  return sendSuccess(res, user);
}