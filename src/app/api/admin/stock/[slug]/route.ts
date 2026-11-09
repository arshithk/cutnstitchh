import { NextResponse, type NextRequest } from "next/server";
import { withDbRetry } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { requireAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function isValidColorEntry(entry: any) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.color === "string" &&
    typeof entry.hex === "string" &&
    (typeof entry.quantity === "number" || typeof entry.quantity === "string")
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    requireAdminSession(request);
    const entry = await withDbRetry(() => StockEntry.findOne({ slug: decodedSlug }).lean());
    if (!entry) {
      return NextResponse.json({ error: "Stock entry not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load stock entry", dbStatus: "disconnected" },
      { status },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    requireAdminSession(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof body.productName === "string") updates.productName = body.productName.trim();
    if (typeof body.productType === "string") updates.productType = body.productType.trim();
    if (typeof body.fabric === "string") updates.fabric = body.fabric.trim();
    if (typeof body.gsmRange === "string") updates.gsmRange = body.gsmRange.trim();
    if (typeof body.lastUpdated === "string") updates.lastUpdated = body.lastUpdated.trim();
    if (typeof body.availableForBulk === "boolean") updates.availableForBulk = body.availableForBulk;
    if (Array.isArray(body.colors) && body.colors.every(isValidColorEntry)) {
      updates.colors = body.colors.map((c: any) => ({
        color: String(c.color).trim(),
        hex: String(c.hex).trim(),
        quantity: Math.max(0, Number(c.quantity) || 0),
      }));
    }
    updates.slug = decodedSlug;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await withDbRetry(() =>
      StockEntry.findOneAndUpdate(
        { slug: decodedSlug },
        { $set: updates },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      ).lean()
    );

    return NextResponse.json(updated);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to update stock entry", dbStatus: "disconnected" },
      { status },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    requireAdminSession(request);
    const deleted = await withDbRetry(() => StockEntry.findOneAndDelete({ slug: decodedSlug }).lean());
    if (!deleted) {
      return NextResponse.json({ error: "Stock entry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to delete stock entry" },
      { status },
    );
  }
}
