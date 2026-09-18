import { NextResponse } from "next/server";
import AdminUser from "@/models/AdminUser";
import { ensureAdminUserExists } from "@/lib/adminUser";
import { generateAdminToken } from "@/lib/auth";
import { createAdminCookie } from "@/lib/adminAuth";

const ALLOWED_ADMIN_EMAIL = "admin@cutnstitch.com";
const ALLOWED_ADMIN_PASSWORD = "VidhyaShankar123";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "Please provide a valid email and password" },
      { status: 400 },
    );
  }

  const inputEmail = body.email.toLowerCase().trim();
  const inputPassword = body.password;

  // Strict check: only admin@cutnstitch.com and VidhyaShankar123 can log in
  if (inputEmail !== ALLOWED_ADMIN_EMAIL || inputPassword !== ALLOWED_ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  // Ensure admin user exists and is up to date in MongoDB
  try {
    await ensureAdminUserExists();
  } catch (err) {
    console.warn("MongoDB sync warning on login:", err);
  }

  const authUser = {
    _id: "admin-root",
    email: ALLOWED_ADMIN_EMAIL,
    role: "admin",
  };

  const token = generateAdminToken(authUser);
  const response = NextResponse.json({
    ok: true,
    success: true,
    email: ALLOWED_ADMIN_EMAIL,
    role: "admin",
  });

  response.headers.append("Set-Cookie", createAdminCookie(token));
  return response;
}
