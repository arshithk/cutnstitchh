import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AdminUserDocument } from "@/models/AdminUser";
import { env } from "./env";

const TOKEN_EXPIRES_IN = "7d";

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export function generateAdminToken(user: Pick<AdminUserDocument, "_id" | "email" | "role">) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.ADMIN_JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRES_IN,
    },
  );
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, env.ADMIN_JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
  } catch {
    return null;
  }
}
