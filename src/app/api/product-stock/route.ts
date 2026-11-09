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
    console.warn("Could not connect to MongoDB for product-stock:", (error as Error)?.message || error);
  }

  const dbEntriesMap = new Map<string, any>();
  for (const entry of dbEntries) {
    if (entry?.slug) {
      dbEntriesMap.set(entry.slug, entry);
    }
  }

  // Canonical list from catalogCategories merged with DB
  const mergedStock = catalogCategories.flatMap((category) =>
    category.variants.map((v) => {
      const dbEntry = dbEntriesMap.get(v.slug);
      const savedColorsMap = new Map<string, number>();
      if (dbEntry && Array.isArray(dbEntry.colors)) {
        for (const c of dbEntry.colors) {
          if (c?.color) {
            savedColorsMap.set(c.color.toLowerCase(), Math.max(0, Number(c.quantity) || 0));
          }
        }
      }

      const colors = (v.colors || []).map((c) => ({
        color: c.name,
        hex: c.hex,
        quantity: savedColorsMap.has(c.name.toLowerCase())
          ? savedColorsMap.get(c.name.toLowerCase())!
          : 0,
      }));

      return {
        _id: dbEntry?._id?.toString() || `${category.slug}-${v.slug}`,
        slug: v.slug,
        productName: v.name,
        productType: category.name,
        productSlug: category.slug,
        variantSlug: v.slug,
        fabric: v.fabric,
        gsmRange: v.gsm,
        lastUpdated: dbEntry?.lastUpdated || new Date().toISOString(),
        availableForBulk: dbEntry?.availableForBulk ?? true,
        colors,
      };
    }),
  );

  for (const entry of dbEntries) {
    if (entry?.slug && !mergedStock.some((s) => s.slug === entry.slug)) {
      mergedStock.push({
        _id: entry._id?.toString() || entry.slug,
        slug: entry.slug,
        productName: entry.productName,
        productType: entry.productType,
        productSlug: entry.slug,
        variantSlug: entry.slug,
        fabric: entry.fabric,
        gsmRange: entry.gsmRange,
        lastUpdated: entry.lastUpdated || new Date().toISOString(),
        availableForBulk: entry.availableForBulk ?? true,
        colors: (entry.colors || []).map((c: any) => ({
          color: c.color,
          hex: c.hex,
          quantity: Math.max(0, Number(c.quantity) || 0),
        })),
      });
    }
  }

  return NextResponse.json(mergedStock);
}
