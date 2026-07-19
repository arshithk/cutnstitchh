import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import { getProductBySlug, products } from "@/data/products";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch dynamic pricing for all variants of this product type
  const dynamicPricingRecords = await prisma.productPricing.findMany({
    where: { productSlug: product.slug } // Or category slug, wait, product.slug in this case maps to category loosely but let's check
  });

  // Inject dynamic prices into all variants
  if (product.variants && dynamicPricingRecords.length > 0) {
    product.variants = product.variants.map((v) => {
      const dbPrice = dynamicPricingRecords.find((dbRecord: any) => dbRecord.variantSlug === v.id);
      let pricing = v.pricing || [];
      if (dbPrice) {
        pricing = [
          { min: 100, max: 999, price: dbPrice.price_100_999 },
          { min: 1000, max: 4999, price: dbPrice.price_1000_4999 },
          { min: 5000, price: dbPrice.price_5000_plus },
        ];
      }
      return { ...v, pricing };
    });
  }

  return (
    <>
      <Header />
      <main>
        <ProductDetails product={product} />
      </main>
      <Footer />
    </>
  );
}
