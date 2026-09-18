import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { catalogCategories } from "@/data/products";

export async function GET() {
  let dbEntries: any[] = [];
  try {
    await dbConnect();
    dbEntries = await StockEntry.find().lean();
  } catch (error) {
    console.warn("Could not connect to MongoDB for product-stock, using catalog fallback:", (error as Error)?.message || error);
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
      if (dbEntry) {
        const savedColorsMap = new Map<string, number>();
        if (Array.isArray(dbEntry.colors)) {
          for (const c of dbEntry.colors) {
            if (c?.color) {
              savedColorsMap.set(c.color.toLowerCase(), c.quantity);
            }
          }
        }

        const colors = (v.colors || []).map((c) => ({
          color: c.name,
          hex: c.hex,
          quantity: savedColorsMap.has(c.name.toLowerCase())
            ? savedColorsMap.get(c.name.toLowerCase())!
            : 250,
        }));

        return {
          _id: dbEntry._id?.toString() || v.slug,
          slug: v.slug,
          productName: v.name,
          productType: category.name,
          productSlug: category.slug,
          variantSlug: v.slug,
          fabric: v.fabric,
          gsmRange: v.gsm,
          lastUpdated: dbEntry.lastUpdated || new Date().toISOString(),
          availableForBulk: dbEntry.availableForBulk ?? true,
          colors,
        };
      }

      return {
        _id: v.slug,
        slug: v.slug,
        productName: v.name,
        productType: category.name,
        productSlug: category.slug,
        variantSlug: v.slug,
        fabric: v.fabric,
        gsmRange: v.gsm,
        lastUpdated: new Date().toISOString(),
        availableForBulk: true,
        colors: (v.colors || []).map((c) => ({
          color: c.name,
          hex: c.hex,
          quantity: 250,
        })),
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
        colors: entry.colors || [],
      });
    }
  }

  return NextResponse.json(mergedStock);
}
