import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import VariantDetails from "@/components/VariantDetails";
import { catalogCategories, getCatalogVariantBySlug, getProductByCategorySlug, getProductPricingByCategorySlug } from "@/data/products";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface VariantPageProps {
  params: Promise<{ category: string; variant: string }>;
}

export default async function VariantPage({ params }: VariantPageProps) {
  const { category, variant } = await params;
  const selectedVariant = getCatalogVariantBySlug(category, variant);

  if (!selectedVariant) {
    notFound();
  }

  const categoryMeta = catalogCategories.find((item) => item.slug === category);
  const product = getProductByCategorySlug(category);

  // Fetch dynamic pricing from DB for this specific variant
  const dbPricing = await prisma.productPricing.findFirst({
    where: { productSlug: category, variantSlug: variant },
  });

  // Build the pricing tiers: prefer static tiers from products.ts but override price from DB
  const staticPricing = selectedVariant?.pricing?.length
    ? selectedVariant.pricing
    : product?.pricing ?? getProductPricingByCategorySlug(category);

  const pricing = dbPricing
    ? [
      { min: 100, max: 999, price: dbPricing.price_100_999 },
      { min: 1000, max: 4999, price: dbPricing.price_1000_4999 },
      { min: 5000, price: dbPricing.price_5000_plus },
    ]
    : staticPricing;

  return (
    <>
      <Header />
      <main>
        <VariantDetails categoryName={categoryMeta?.name ?? "Product"} variant={selectedVariant} pricing={pricing} />
      </main>
      <Footer />
    </>
  );
}
