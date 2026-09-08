import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "./auth";

export const ADMIN_COOKIE_NAME = "cutnstitch_admin_token";

function getTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")[1] ?? null;
}

export function getAdminTokenFromRequest(request: Request | NextRequest) {
  if ("cookies" in request) {
    return request.cookies.get(ADMIN_COOKIE_NAME)?.value ?? null;
  }
  return getTokenFromCookieHeader(request.headers.get("cookie"));
}

export function getAdminSession(request: Request | NextRequest) {
  const token = getAdminTokenFromRequest(request);
  if (!token) return null;
  return verifyAdminToken(token);
}

export function requireAdminSession(request: Request | NextRequest) {
  const session = getAdminSession(request);
  if (!session) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    throw error;
  }
  return session;
}

const cookieSecurityFlags = process.env.NODE_ENV === "production" ? "Secure; " : "";

export function createAdminCookie(token: string) {
  return `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; ${cookieSecurityFlags}Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAdminCookie() {
  return `${ADMIN_COOKIE_NAME}=; HttpOnly; ${cookieSecurityFlags}Path=/; Max-Age=0; SameSite=Lax`;
}
