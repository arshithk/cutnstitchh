import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdminSession } from "@/lib/adminAuth";

const REQUIRED_PRODUCT_FIELDS = [
  "slug",
  "name",
  "category",
  "tagline",
  "moq",
  "fabric",
  "gsmRange",
  "description",
  "heroImage",
];

export async function GET(request: Request) {
  try {
    requireAdminSession(request);
    await dbConnect();
    const products = await Product.find().lean();
    return NextResponse.json(products);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load products" },
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

    for (const field of REQUIRED_PRODUCT_FIELDS) {
      if (!body[field] || typeof body[field] !== "string") {
        return NextResponse.json(
          { error: `Missing or invalid required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const slug = body.slug.trim();
    if (slug.length === 0) {
      return NextResponse.json({ error: "Slug must be a non-empty string" }, { status: 400 });
    }

    await dbConnect();
    const existingProduct = await Product.findOne({ slug }).lean();
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 },
      );
    }

    const product = await Product.create({
      slug,
      name: body.name.trim(),
      category: body.category.trim(),
      tagline: body.tagline.trim(),
      moq: body.moq.trim(),
      fabric: body.fabric.trim(),
      gsmRange: body.gsmRange.trim(),
      description: body.description.trim(),
      heroImage: body.heroImage.trim(),
      availableForBulk: Boolean(body.availableForBulk ?? true),
      premiumQuality: Boolean(body.premiumQuality ?? false),
      deliveryTimeline:
        typeof body.deliveryTimeline === "string" ? body.deliveryTimeline.trim() : "",
      colors: Array.isArray(body.colors) ? body.colors : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      pricing: Array.isArray(body.pricing) ? body.pricing : [],
      features: Array.isArray(body.features) ? body.features : [],
      relatedSlugs: Array.isArray(body.relatedSlugs) ? body.relatedSlugs : [],
      inquiryOnly: Boolean(body.inquiryOnly ?? false),
      variants: Array.isArray(body.variants) ? body.variants : [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to create product" },
      { status },
    );
  }
}
