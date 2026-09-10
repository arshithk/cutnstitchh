import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { catalogCategories } from "@/data/products";

export async function GET() {
  try {
    await dbConnect();
    const stockEntries = await StockEntry.find().lean();
    if (stockEntries && stockEntries.length > 0) {
      return NextResponse.json(stockEntries);
    }
  } catch (error) {
    // Database connection failed, fall through to static fallback
  }

  const fallbackStock = catalogCategories.flatMap((category) =>
    category.variants.map((v) => ({
      slug: v.slug,
      productName: v.name,
      productType: category.name,
      fabric: v.fabric,
      gsmRange: v.gsm,
      lastUpdated: new Date().toISOString(),
      availableForBulk: true,
      colors: (v.colors || []).map((c) => ({
        color: c.name,
        hex: c.hex,
        quantity: 250,
      })),
    })),
  );

  return NextResponse.json(fallbackStock);
}
