import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

function hasAdminToken(request: NextRequest) {
  return Boolean(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiRoute = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isAuthApiRoute = pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout";
  const tokenPresent = hasAdminToken(request);

  if (isLoginRoute && tokenPresent) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminRoute && !isLoginRoute && !tokenPresent) {
    const destination = new URL("/admin/login", request.url);
    destination.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(destination);
  }

  if (isAdminApiRoute && !isAuthApiRoute && !tokenPresent) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*", "/api/admin"],
};
