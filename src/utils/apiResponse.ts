import { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 500
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}