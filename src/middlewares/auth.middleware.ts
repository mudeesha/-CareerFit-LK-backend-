import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { findUserById } from "../repositories/auth/auth.repository";
import { AppError } from "../../utils/appError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET_MISSING", "JWT secret is not configured", 500);
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new AppError("UNAUTHORIZED", "Invalid token user", 401);
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("ACCOUNT_DISABLED", "Your account is disabled", 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("UNAUTHORIZED", "Invalid or expired token", 401);
  }
}

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("UNAUTHORIZED", "Authentication required", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("FORBIDDEN", "You do not have permission", 403);
    }

    next();
  };
}