import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().sort({ updatedAt: -1 }).lean();
    if (!settings) {
      return NextResponse.json(
        { error: "Site settings not configured" },
        { status: 404 },
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load site settings" },
      { status },
    );
  }
}
