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

  try {
    await dbConnect();
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
    // Database connection failed
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

import { getKeywordsForCategory } from "@/lib/seoKeywords";

const CATEGORY_CUSTOM_TITLES: Record<string, { title: string; desc: string }> = {
  "regular-fit": {
    title: "Round Neck T-Shirt Manufacturer in Bangalore | 180 GSM Bio-Washed Tees",
    desc: "Premium 180 GSM bio-washed combed cotton regular fit round neck t-shirts. Custom screen printing, DTF, embroidery & private labeling in Bangalore. Low MOQ 100 pcs.",
  },
  oversized: {
    title: "Oversized T-Shirt Manufacturer India | 240 GSM Heavyweight Streetwear Blanks",
    desc: "India's leading oversized t-shirt manufacturer. Heavyweight 220-280 GSM French Terry, drop-shoulder cuts, custom puff printing & private label tags in Bangalore.",
  },
  polo: {
    title: "Polo T-Shirt Manufacturer in Bangalore | Custom Embroidered Corporate Polos",
    desc: "Manufacturer of premium 220-240 GSM Pique, Matty & Combed Cotton polo t-shirts in Bangalore. Custom embroidery, tipping collars & corporate uniform orders.",
  },
  hoodie: {
    title: "Custom Hoodie Manufacturer in Bangalore | 300-360 GSM Heavyweight Fleece",
    desc: "Custom hoodies manufacturer in Bangalore. Premium 300-360 GSM brushed fleece and French Terry, double-layered hoods, zip & pullover styles, low MOQ 100 pcs.",
  },
  sweatshirt: {
    title: "Custom Sweatshirt Manufacturer in Bangalore | French Terry & Fleece Crewnecks",
    desc: "Tailored crewneck sweatshirts manufacturer in Bangalore. French Terry loopknit, ribbed trims, soft-touch fabric, custom printing and embroidery.",
  },
  shorts: {
    title: "Custom Shorts Manufacturer in Bangalore | French Terry & 2-Way Lycra Athletic",
    desc: "Custom gym shorts & French Terry lounge shorts manufacturer in Bangalore. 2-way Lycra stretch, zipper pockets, custom drawstrings, bulk wholesale supply.",
  },
  joggers: {
    title: "Custom Joggers Manufacturer in Bangalore | 4-Way Lycra Performance Track Pants",
    desc: "Tapered athletic joggers & sweatpants manufacturer in Bangalore. 4-way Lycra stretch, zippered pockets, ribbed cuffs & activewear branding.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  try {
    const { category } = await params;
    const categoryData = await loadCategoryData(category);
    const categoryName = categoryData?.name ?? category.replace(/-/g, " ");

    const customMeta = CATEGORY_CUSTOM_TITLES[category];
    const title = customMeta ? customMeta.title : `${categoryName} Manufacturer in Bangalore | Cut N Stitch`;
    const description =
      customMeta?.desc ??
      categoryData?.description ??
      `Custom ${categoryName} manufacturing in Bangalore, India. Direct factory prices, premium fabrics, low MOQ (100 pcs), private labeling, and bulk supply.`;

    const keywords = getKeywordsForCategory(category);

    return {
      title,
      description,
      keywords,
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
