import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

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

    return NextResponse.json(products);
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to load products" },
      { status },
    );
  }
}
