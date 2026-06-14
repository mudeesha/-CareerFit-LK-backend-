import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/auth/auth.repository";

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };

    const user = await findUserById(decoded.userId);

    if (!user || user.status !== "ACTIVE") {
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch {
    return next();
  }
}