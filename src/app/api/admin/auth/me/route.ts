import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const session = getAdminSession(request as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.sub === "env-admin") {
    return NextResponse.json({ email: session.email, role: session.role });
  }

  try {
    await dbConnect();
    const user = await AdminUser.findById(session.sub).lean();
    if (user) {
      return NextResponse.json({ email: user.email, role: user.role });
    }
  } catch (error) {
    console.warn("Database lookup skipped in /api/admin/auth/me:", (error as Error)?.message || error);
  }

  return NextResponse.json({ email: session.email, role: session.role });
}

