import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { getAdminSession } from "@/lib/adminAuth";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = getAdminSession(request as any);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.currentPassword !== "string") {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }

    const { email, password, currentPassword } = body as {
      email?: string;
      password?: string;
      currentPassword: string;
    };

    if (!email && !password) {
      return NextResponse.json(
        { error: "Email or password must be provided" },
        { status: 400 },
      );
    }

    await dbConnect();
    const user = await AdminUser.findById(session.sub);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 401 });
    }

    if (typeof email === "string" && email.trim().length > 0) {
      user.email = email.toLowerCase().trim();
    }

    if (typeof password === "string" && password.length > 0) {
      user.passwordHash = hashPassword(password);
    }

    await user.save();
    return NextResponse.json({ ok: true, email: user.email });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to update settings" },
      { status: 500 },
    );
  }
}
