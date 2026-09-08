import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  try {
    if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });

    await dbConnect();
    const product = await Product.findOne({ slug }).select("pricing variants.pricing variants.slug variants.name").lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Compose pricing info: top-level pricing + per-variant pricing
    const pricing = {
      productPricing: product.pricing ?? [],
      variants: (product.variants || []).map((v: any) => ({ slug: v.slug, name: v.name, pricing: v.pricing || [] })),
    };

    return NextResponse.json(pricing);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load pricing" },
      { status },
    );
  }
}
