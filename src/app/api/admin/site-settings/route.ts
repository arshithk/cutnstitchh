import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { requireAdminSession } from "@/lib/adminAuth";

import { env } from "@/lib/env";

const defaultSettings = {
  contactEmail: env.SITE_CONTACT_EMAIL ?? "vidhyashankar@cutnstitchapparel.com",
  phoneNumber: env.SITE_PHONE_NUMBER ?? "+91 99 444 66 3 11",
  whatsAppNumber: env.SITE_WHATSAPP_NUMBER ?? "+91 99444 66311",
  defaultMoq: "100 Pieces",
  productionLeadTime: "8-10 business days",
};

export async function GET(request: Request) {
  try {
    requireAdminSession(request);
    await dbConnect();
    const settings = await SiteSettings.findOne().sort({ updatedAt: -1 }).lean();
    return NextResponse.json(settings ?? defaultSettings);
  } catch (error) {
    console.warn("Could not load site settings from database, falling back to defaults:", (error as Error)?.message || error);
    return NextResponse.json(defaultSettings);
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
    const msg = (error as Error).message ?? "Unable to update site settings";
    const friendlyMsg = msg.includes("ECONNREFUSED") || msg.includes("MongoDB")
      ? "Database connection unavailable. Please ensure MongoDB service is running."
      : msg;
    return NextResponse.json({ error: friendlyMsg }, { status });
  }
}
