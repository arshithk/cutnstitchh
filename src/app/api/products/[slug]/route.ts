import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { getProductBySlug } from "@/data/products";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  try {
    if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });

    try {
      await dbConnect();
      const product = await Product.findOne({ slug }).lean();
      if (product) return NextResponse.json(product);
    } catch (dbErr) {
      // Database connection failed, fall through to static fallback
    }

    const fallback = getProductBySlug(slug);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load product" },
      { status },
    );
  }
}
