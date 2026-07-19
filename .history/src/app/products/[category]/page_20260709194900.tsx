import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VariantListing from "@/components/VariantListing";
import { catalogCategories, getCatalogCategoryBySlug } from "@/data/products";

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ category: category.slug }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const selectedCategory = getCatalogCategoryBySlug(category);

  if (!selectedCategory) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <VariantListing category={selectedCategory} />
      </main>
      <Footer />
    </>
  );
}
