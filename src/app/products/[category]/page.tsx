import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VariantListing from "@/components/VariantListing";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { getCatalogCategoryBySlug, getProductBySlug, products as fallbackProducts } from "@/data/products";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const CATALOG_TO_PRODUCT_SLUG: Record<string, string> = {
  "regular-fit": "regular-fit-t-shirts",
  polo: "polo-t-shirts",
  oversized: "oversized-t-shirts",
  shorts: "shorts",
  joggers: "joggers",
};

async function loadCategoryData(category: string) {
  try {
    await dbConnect();

    const productSlug = CATALOG_TO_PRODUCT_SLUG[category] ?? category;
    const product = await Product.findOne({ slug: productSlug }).lean();

    if (product) {
      return {
        name: product.name,
        slug: category,
        description: product.description,
        variants: product.variants || [],
      };
    }
  } catch (error) {
    // Database connection failed, use fallback data
  }

  const catalogCat = getCatalogCategoryBySlug(category);
  if (catalogCat) {
    return {
      name: catalogCat.name,
      slug: category,
      description: catalogCat.description,
      variants: catalogCat.variants as any,
    };
  }

  const productSlug = CATALOG_TO_PRODUCT_SLUG[category] ?? category;
  const fallbackProduct = getProductBySlug(productSlug) || getProductBySlug(category);
  if (fallbackProduct) {
    return {
      name: fallbackProduct.name,
      slug: category,
      description: fallbackProduct.description,
      variants: (fallbackProduct.variants || []).map((v: any) => ({
        ...v,
        slug: v.slug || v.id,
      })) as any,
    };
  }

  return null;
}

export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({}, { slug: 1 }).lean();

    const slugs = new Set<string>(
      Object.keys(CATALOG_TO_PRODUCT_SLUG).concat((products || []).map((p: any) => p.slug)),
    );

    return Array.from(slugs).map((category) => ({ category }));
  } catch (error) {
    const slugs = new Set<string>(
      Object.keys(CATALOG_TO_PRODUCT_SLUG).concat(fallbackProducts.map((p) => p.slug)),
    );
    return Array.from(slugs).map((category) => ({ category }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  try {
    const { category } = await params;
    const categoryData = await loadCategoryData(category);
    const categoryName = categoryData?.name ?? category.replace(/-/g, " ");

    const title = `${categoryName} Manufacturer in Bangalore`;
    const description =
      categoryData?.description ??
      `Custom ${categoryName} manufacturing in Bangalore, India. Premium fabrics, low MOQ, private labeling, and bulk supply.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/products/${category}`,
      },
      openGraph: {
        title,
        description,
        url: `https://cutnstitchapparel.com/products/${category}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: "B2B Apparel Products | Cut N Stitch Apparel",
      description: "Custom apparel manufacturing in Bangalore, India.",
    };
  }
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const selectedCategory = (await loadCategoryData(category)) || {
    name: category.replace(/-/g, " "),
    slug: category,
    description: undefined,
    variants: [],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cutnstitchapparel.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://cutnstitchapparel.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: selectedCategory.name,
        item: `https://cutnstitchapparel.com/products/${category}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Header />
      <main>
        <VariantListing category={selectedCategory} />
      </main>
      <Footer />
    </>
  );
}
