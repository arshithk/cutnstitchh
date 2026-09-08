import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { requireAdminSession } from "@/lib/adminAuth";

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

    const slug = body.slug.trim();
    if (slug.length === 0) {
      return NextResponse.json({ error: "Slug must be a non-empty string" }, { status: 400 });
    }

    await dbConnect();
    const existingEntry = await StockEntry.findOne({ slug }).lean();
    if (existingEntry) {
      return NextResponse.json(
        { error: "A stock entry with this slug already exists" },
        { status: 409 },
      );
    }

    const entry = await StockEntry.create({
      slug,
      productName: body.productName.trim(),
      productType: body.productType.trim(),
      fabric: body.fabric.trim(),
      gsmRange: body.gsmRange.trim(),
      lastUpdated: body.lastUpdated.trim(),
      availableForBulk: Boolean(body.availableForBulk ?? true),
      colors: body.colors,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to create stock entry" },
      { status },
    );
  }
}
