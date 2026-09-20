import { NextResponse } from "next/server";
import { withDbRetry } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { requireAdminSession } from "@/lib/adminAuth";
import { catalogCategories } from "@/data/products";

const REQUIRED_STOCK_FIELDS = [
  "slug",
  "productName",
  "productType",
  "fabric",
  "gsmRange",
  "lastUpdated",
];

function isValidColorEntry(entry: any) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.color === "string" &&
    typeof entry.hex === "string" &&
    typeof entry.quantity === "number"
  );
}

export async function GET(request: Request) {
  try {
    requireAdminSession(request);
  } catch (authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dbEntries: any[] = [];
  try {
    dbEntries = await withDbRetry(() => StockEntry.find().lean());
  } catch (error) {
    console.warn("Could not load stock entries from database:", (error as Error)?.message || error);
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

export async function POST(request: Request) {
  try {
    requireAdminSession(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    for (const field of REQUIRED_STOCK_FIELDS) {
      if (!body[field] || typeof body[field] !== "string") {
        return NextResponse.json(
          { error: `Missing or invalid required field: ${field}` },
          { status: 400 },
        );
      }
    }

    if (!Array.isArray(body.colors) || body.colors.some((item: any) => !isValidColorEntry(item))) {
      return NextResponse.json(
        { error: "Colors must be an array of valid color objects" },
        { status: 400 },
      );
    }

    const created = await withDbRetry(() =>
      StockEntry.findOneAndUpdate(
        { slug: body.slug.trim() },
        {
          $set: {
            slug: body.slug.trim(),
            productName: body.productName.trim(),
            productType: body.productType.trim(),
            fabric: body.fabric.trim(),
            gsmRange: body.gsmRange.trim(),
            lastUpdated: body.lastUpdated || new Date().toISOString(),
            availableForBulk: body.availableForBulk ?? true,
            colors: body.colors,
          },
        },
        { new: true, upsert: true, runValidators: true },
      ).lean()
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to create stock entry" },
      { status },
    );
  }
}
