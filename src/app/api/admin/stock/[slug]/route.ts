import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import StockEntry from "@/models/StockEntry";
import { requireAdminSession } from "@/lib/adminAuth";

function isValidColorEntry(entry: any) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.color === "string" &&
    typeof entry.hex === "string" &&
    typeof entry.quantity === "number"
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    requireAdminSession(request);
    await dbConnect();
    const entry = await StockEntry.findOne({ slug }).lean();
    if (!entry) {
      return NextResponse.json({ error: "Stock entry not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load stock entry" },
      { status },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
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
    if (Array.isArray(body.colors) && body.colors.every(isValidColorEntry)) updates.colors = body.colors;
    if (typeof body.slug === "string") {
      const slug = body.slug.trim();
      if (slug.length === 0) {
        return NextResponse.json({ error: "Slug cannot be empty" }, { status: 400 });
      }
      updates.slug = slug;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await dbConnect();
    const updated = await StockEntry.findOneAndUpdate({ slug }, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Stock entry not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to update stock entry" },
      { status },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    requireAdminSession(request);
    await dbConnect();
    const deleted = await StockEntry.findOneAndDelete({ slug }).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Stock entry not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to delete stock entry" },
      { status },
    );
  }
}
