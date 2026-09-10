import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VariantDetails from "@/components/VariantDetails";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import {
  catalogCategories,
  getCatalogVariantBySlug,
  getCatalogCategoryBySlug,
  getProductBySlug,
} from "@/data/products";

const CATALOG_TO_PRODUCT_SLUG: Record<string, string> = {
  "regular-fit": "regular-fit-t-shirts",
  polo: "polo-t-shirts",
  oversized: "oversized-t-shirts",
  shorts: "shorts",
  joggers: "joggers",
};

async function loadVariantData(category: string, variant: string) {
  // Check catalogCategories first (contains all high-res images and complete specs)
  const catalogVar = getCatalogVariantBySlug(category, variant);
  if (catalogVar) {
    const cat = getCatalogCategoryBySlug(category);
    return {
      product: { name: cat?.name ?? category, slug: category },
      selectedVariant: catalogVar,
    };
  }

  const productSlug = CATALOG_TO_PRODUCT_SLUG[category] ?? category;
  const fallbackProd = getProductBySlug(category) || getProductBySlug(productSlug);
  if (fallbackProd) {
    const v = (fallbackProd.variants || []).find((x: any) => (x.slug || x.id) === variant);
    if (v) {
      return { product: fallbackProd, selectedVariant: v };
    }
  }

  try {
    await dbConnect();
    const product: any = await Product.findOne({
      $or: [{ slug: category }, { slug: productSlug }],
    }).lean();

    if (product) {
      const selectedVariant = (product.variants || []).find(
        (v: any) => (v.slug || v.id) === variant,
      );
      if (selectedVariant) {
        return { product, selectedVariant };
      }
    }
  } catch (error) {
    // Database connection failed, use fallback data
  }

  return { product: null, selectedVariant: null };
}

export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({}, { variants: 1, slug: 1 }).lean();
    if (products && products.length > 0) {
      const params: Array<{ category: string; variant: string }> = [];
      products.forEach((p: any) => {
        const category = p.slug;
        (p.variants || []).forEach((v: any) => {
          const vSlug = v.slug || v.id;
          if (vSlug) params.push({ category, variant: vSlug });
        });
      });
      if (params.length > 0) return params;
    }
  } catch (error) {
    // Database connection failed, use fallback data
  }

  const params: Array<{ category: string; variant: string }> = [];
  catalogCategories.forEach((cat) => {
    cat.variants.forEach((v) => {
      params.push({ category: cat.slug, variant: v.slug });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; variant: string }>;
}): Promise<Metadata> {
  const { category, variant } = await params;
  const { product, selectedVariant } = await loadVariantData(category, variant);

  if (!product || !selectedVariant) {
    return {
      title: "Apparel Variant | Cut N Stitch Apparel",
      description: "Explore custom apparel manufacturing options at Cut N Stitch Apparel.",
    };
  }

  const title = `${selectedVariant.name} (${selectedVariant.gsmRange || selectedVariant.gsm || ""})`;
  const description = `${selectedVariant.description || product.description} Custom manufacturing, low MOQ, and bulk supply in Bangalore, India.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${category}/${variant}`,
    },
    openGraph: {
      title,
      description,
      url: `https://cutnstitchapparel.com/products/${category}/${variant}`,
      type: "article",
      images: selectedVariant.heroImage
        ? [
            {
              url: selectedVariant.heroImage,
              alt: `${selectedVariant.name} - Cut N Stitch Apparel`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: selectedVariant.heroImage ? [selectedVariant.heroImage] : undefined,
    },
  };
}

interface VariantPageProps {
  params: Promise<{ category: string; variant: string }>;
}

export default async function VariantPage({ params }: VariantPageProps) {
  const { category, variant } = await params;
  const { product, selectedVariant } = await loadVariantData(category, variant);

  if (!product || !selectedVariant) notFound();

  const pricing = selectedVariant.pricing?.length ? selectedVariant.pricing : product.pricing ?? [];

  const lowestPrice = pricing.length ? Math.min(...pricing.map((p: any) => p.price)) : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${selectedVariant.name} - ${product.name}`,
    description: selectedVariant.description || product.description,
    image: selectedVariant.heroImage
      ? `https://cutnstitchapparel.com${selectedVariant.heroImage}`
      : undefined,
    brand: {
      "@type": "Brand",
      name: "Cut N Stitch Apparel",
    },
    offers: lowestPrice
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: lowestPrice,
          offerCount: pricing.length,
          availability: "https://schema.org/InStock",
        }
      : undefined,
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
        name: product.name,
        item: `https://cutnstitchapparel.com/products/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: selectedVariant.name,
        item: `https://cutnstitchapparel.com/products/${category}/${variant}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Header />
      <main>
        <VariantDetails categoryName={product.name ?? "Product"} variant={selectedVariant} pricing={pricing} />
      </main>
      <Footer />
    </>
  );
}
