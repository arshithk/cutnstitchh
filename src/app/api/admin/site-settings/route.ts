import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    requireAdminSession(request);
    await dbConnect();
    const settings = await SiteSettings.findOne().sort({ updatedAt: -1 }).lean();
    return NextResponse.json(settings ?? null);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load site settings" },
      { status },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    requireAdminSession(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    for (const field of ["contactEmail", "phoneNumber", "whatsAppNumber", "defaultMoq", "productionLeadTime"] as const) {
      if (typeof body[field] === "string") {
        updateData[field] = body[field].trim();
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await dbConnect();
    const settings = await SiteSettings.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();

    return NextResponse.json(settings);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to update site settings" },
      { status },
    );
  }
}
