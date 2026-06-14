import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { LoginDto, RegisterDto } from "../../dtos/auth/auth.dto";
import {
  createUserWithProfile,
  findUserByEmail,
  findUserById,
} from "../../repositories/auth/auth.repository";
import { AppError } from "../../utils/appError";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET_MISSING", "JWT secret is not configured", 500);
  }

  return secret;
}

function generateToken(userId: string) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, getJwtSecret(), options);
}

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function registerService(data: RegisterDto) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError("EMAIL_ALREADY_EXISTS", "Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUserWithProfile({
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role,
    fullName: data.fullName,
    phone: data.phone,
    district: data.district,
    position: data.position,
  });

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function loginService(data: LoginDto) {
  const user = await findUserByEmail(data.email.toLowerCase());

  if (!user || !user.password) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("ACCOUNT_DISABLED", "Your account is disabled", 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function getMeService(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("USER_NOT_FOUND", "User not found", 404);
  }

  return sanitizeUser(user);
}