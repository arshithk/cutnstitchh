import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return payload.email === "admin@cutnstitch.com";
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";
  const isLogoutRoute = pathname === "/admin/logout";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiRoute = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isAuthApiRoute =
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = isTokenValid(token);



  if (isAdminRoute && !isLoginRoute && !isLogoutRoute && !authenticated) {
    const destination = new URL("/admin/login", request.url);
    destination.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(destination);
  }

  if (isAdminApiRoute && !isAuthApiRoute && !authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*", "/api/admin"],
};
