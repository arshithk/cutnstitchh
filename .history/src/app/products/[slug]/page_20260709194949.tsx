import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import { getCatalogCategorySlugByLegacyProductSlug, getProductBySlug, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const mappedCategorySlug = getCatalogCategorySlugByLegacyProductSlug(slug);

  if (mappedCategorySlug) {
    redirect(`/products/${mappedCategorySlug}`);
  }

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
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
