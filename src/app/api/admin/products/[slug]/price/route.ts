import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdminSession } from "@/lib/adminAuth";

interface PricingTier {
  min: number;
  max?: number;
  price: number;
}

function findPricingTier(pricing: PricingTier[], quantity: number) {
  const sorted = [...pricing].sort((a, b) => a.min - b.min);
  return sorted.find((tier) => {
    if (quantity < tier.min) return false;
    if (tier.max === undefined || tier.max === null) return true;
    return quantity <= tier.max;
  }) ?? null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    requireAdminSession(request);
    const url = new URL(request.url);
    const quantityParam = url.searchParams.get("quantity");
    const quantity = Number(quantityParam);

    if (!quantityParam || Number.isNaN(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity query parameter is required and must be a positive number" },
        { status: 400 },
      );
    }

    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const pricing = Array.isArray(product.pricing) ? product.pricing : [];
    const tier = findPricingTier(pricing, quantity);
    if (!tier) {
      return NextResponse.json(
        { error: "No pricing available for the requested quantity" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      slug: product.slug,
      quantity,
      price: tier.price,
      tier,
    });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to calculate price" },
      { status },
    );
  }
}
