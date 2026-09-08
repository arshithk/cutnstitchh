import { NextResponse } from "next/server";
import AdminUser from "@/models/AdminUser";
import { ensureAdminUserExists } from "@/lib/adminUser";
import { verifyPassword, generateAdminToken } from "@/lib/auth";
import { createAdminCookie } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await ensureAdminUserExists();

    const user = await AdminUser.findOne({ email: body.email.toLowerCase().trim() }).lean();
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordValid = verifyPassword(body.password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = generateAdminToken({ _id: user._id, email: user.email, role: user.role });
    const response = NextResponse.json({ ok: true, email: user.email, role: user.role });
    response.headers.append("Set-Cookie", createAdminCookie(token));

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to complete login" },
      { status: 500 },
    );
  }
}
