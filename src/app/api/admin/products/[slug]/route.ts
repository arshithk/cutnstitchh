import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdminSession } from "@/lib/adminAuth";

const UPDATE_FIELDS = [
  "slug",
  "name",
  "category",
  "tagline",
  "moq",
  "fabric",
  "gsmRange",
  "description",
  "heroImage",
  "availableForBulk",
  "premiumQuality",
  "deliveryTimeline",
  "colors",
  "sizes",
  "pricing",
  "features",
  "relatedSlugs",
  "inquiryOnly",
  "variants",
];

import { products as fallbackProducts } from "@/data/products";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    requireAdminSession(request);
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.warn("Could not load product from MongoDB, falling back to static catalog:", (error as Error)?.message || error);
    const fallback = fallbackProducts.find((p) => p.slug === slug);
    if (fallback) {
      return NextResponse.json({ ...fallback, _id: `fallback-${slug}` });
    }
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
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

    const updateData: Record<string, unknown> = {};
    for (const field of UPDATE_FIELDS) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    if (typeof updateData.slug === "string") {
      updateData.slug = updateData.slug.trim();
      if ((updateData.slug as string).length === 0) {
        return NextResponse.json({ error: "Slug cannot be empty" }, { status: 400 });
      }
    }

    await dbConnect();
    const product = await Product.findOneAndUpdate(
      { slug },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    const msg = (error as Error).message ?? "Unable to update product";
    const friendlyMsg = msg.includes("ECONNREFUSED") || msg.includes("MongoDB")
      ? "Database connection unavailable. Please ensure MongoDB service is running."
      : msg;
    return NextResponse.json({ error: friendlyMsg }, { status });
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
    const deleted = await Product.findOneAndDelete({ slug }).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    const msg = (error as Error).message ?? "Unable to delete product";
    const friendlyMsg = msg.includes("ECONNREFUSED") || msg.includes("MongoDB")
      ? "Database connection unavailable. Please ensure MongoDB service is running."
      : msg;
    return NextResponse.json({ error: friendlyMsg }, { status });
  }
}

