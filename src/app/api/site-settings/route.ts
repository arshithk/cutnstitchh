import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const defaultSettings = {
  contactEmail: "vidhyashankar@cutnstitchapparel.com",
  phoneNumber: "+91 99 444 66 3 11",
  whatsAppNumber: "+91 99444 66311",
  defaultMoq: "100 Pieces",
  productionLeadTime: "8-10 business days",
};

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().sort({ updatedAt: -1 }).lean();
    if (settings) {
      return NextResponse.json(settings);
    }
  } catch (error) {
    // Database connection or query failed, return default settings
  }

  return NextResponse.json(defaultSettings);
}
