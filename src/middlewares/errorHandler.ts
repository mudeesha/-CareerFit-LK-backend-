import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { sendError } from "../utils/apiResponse";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode);
  }

  return sendError(res, "INTERNAL_SERVER_ERROR", "Something went wrong", 500);
}