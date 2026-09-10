import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { products as fallbackProducts } from "@/data/products";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find(
      {},
      {
        slug: 1,
        name: 1,
        category: 1,
        tagline: 1,
        moq: 1,
        heroImage: 1,
        availableForBulk: 1,
      },
    )
      .sort({ name: 1 })
      .lean();

    if (products && products.length > 0) {
      return NextResponse.json(products);
    }
  } catch (error) {
    // Database connection failed, fall through to static products
  }

  return NextResponse.json(
    fallbackProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      moq: p.moq,
      heroImage: p.heroImage,
      availableForBulk: p.availableForBulk,
    })),
  );
}
