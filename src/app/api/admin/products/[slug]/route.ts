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
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load product" },
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
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to update product" },
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
    const deleted = await Product.findOneAndDelete({ slug }).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to delete product" },
      { status },
    );
  }
}
