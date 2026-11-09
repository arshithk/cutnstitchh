import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { catalogCategories } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbEntries: any[] = [];
  try {
    await dbConnect();
    dbEntries = await StockEntry.find().lean();
  } catch (error) {
    console.warn("Could not connect to MongoDB for live stock:", (error as Error)?.message || error);
    return NextResponse.json([]);
  }

  const dbEntriesMap = new Map<string, any>();
  for (const entry of dbEntries) {
    if (entry?.slug) {
      dbEntriesMap.set(entry.slug, entry);
    }
  }

  const result: any[] = [];

  // Match saved DB entries to catalog categories
  for (const category of catalogCategories) {
    for (const v of category.variants) {
      const dbEntry = dbEntriesMap.get(v.slug);
      // Only include variants that have actually been saved in the DB and are available
      if (!dbEntry || dbEntry.availableForBulk === false) {
        continue;
      }

      const savedColorsMap = new Map<string, number>();
      if (Array.isArray(dbEntry.colors)) {
        for (const c of dbEntry.colors) {
          if (c?.color) {
            savedColorsMap.set(c.color.toLowerCase(), Math.max(0, Number(c.quantity) || 0));
          }
        }
      }

      // Filter to ONLY colors with available stock (quantity > 0)
      const availableColors = (v.colors || [])
        .map((c) => ({
          color: c.name,
          hex: c.hex,
          quantity: savedColorsMap.has(c.name.toLowerCase())
            ? savedColorsMap.get(c.name.toLowerCase())!
            : 0,
        }))
        .filter((c) => c.quantity > 0);

      // Only display variants in live stock if at least one color is in stock
      if (availableColors.length > 0) {
        const totalQuantity = availableColors.reduce((sum, c) => sum + c.quantity, 0);
        result.push({
          _id: dbEntry._id?.toString() || `${category.slug}-${v.slug}`,
          slug: v.slug,
          productName: v.name,
          productType: category.name,
          productSlug: category.slug,
          variantSlug: v.slug,
          fabric: v.fabric,
          gsmRange: v.gsm,
          lastUpdated: dbEntry.lastUpdated || new Date().toISOString(),
          availableForBulk: true,
          quantity: totalQuantity,
          colors: availableColors,
        });
      }
    }
  }

  // Include any custom standalone entries from DB if not already added
  for (const entry of dbEntries) {
    if (entry?.slug && !result.some((s) => s.slug === entry.slug) && entry.availableForBulk !== false) {
      const availableColors = (entry.colors || [])
        .map((c: any) => ({
          color: c.color,
          hex: c.hex,
          quantity: Math.max(0, Number(c.quantity) || 0),
        }))
        .filter((c: any) => c.quantity > 0);

      if (availableColors.length > 0) {
        const totalQuantity = availableColors.reduce((sum: number, c: any) => sum + c.quantity, 0);
        result.push({
          _id: entry._id?.toString() || entry.slug,
          slug: entry.slug,
          productName: entry.productName,
          productType: entry.productType,
          productSlug: entry.slug,
          variantSlug: entry.slug,
          fabric: entry.fabric,
          gsmRange: entry.gsmRange,
          lastUpdated: entry.lastUpdated || new Date().toISOString(),
          availableForBulk: true,
          quantity: totalQuantity,
          colors: availableColors,
        });
      }
    }
  }

  return NextResponse.json(result);
}
