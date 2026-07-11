import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VariantDetails from "@/components/VariantDetails";
import { catalogCategories, getCatalogVariantBySlug, getProductPricingByCategorySlug } from "@/data/products";

export function generateStaticParams() {
  return catalogCategories.flatMap((category) =>
    category.variants.map((variant) => ({
      category: category.slug,
      variant: variant.slug,
    }))
  );
}

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
  const pricing = getProductPricingByCategorySlug(category);

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
