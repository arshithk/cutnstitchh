import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";

export async function GET() {
  try {
    await dbConnect();
    const stockEntries = await StockEntry.find().lean();
    return NextResponse.json(stockEntries);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load stock entries" },
      { status },
    );
  }
}
