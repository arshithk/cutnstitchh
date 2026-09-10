import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { getProductBySlug, products as fallbackProducts } from "@/data/products";

async function loadProductData(slug: string) {
  const staticProduct = getProductBySlug(slug);
  if (staticProduct) {
    return staticProduct;
  }

  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (product) return product;
  } catch (error) {
    // Database connection failed, use fallback data
  }

  return null;
}

export async function generateStaticParams() {
  try {
    await dbConnect();
    const docs = await Product.find({}, { slug: 1 }).lean();
    if (docs && docs.length > 0) {
      return docs.map((d: any) => ({ slug: d.slug }));
    }
  } catch (error) {
    // Database connection failed, use fallback data
  }

  return fallbackProducts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductData(slug);

  if (!product) {
    return {
      title: "Product Details | Cut N Stitch Apparel",
      description: "Explore custom apparel manufacturing at Cut N Stitch Apparel.",
    };
  }

  const title = `${product.name} Manufacturer in Bangalore`;
  const description = `${product.description} High-quality custom manufacturing, low MOQ, private labeling, and bulk supply in Bangalore, India.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/details/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://cutnstitchapparel.com/products/details/${slug}`,
      type: "article",
      images: product.heroImage
        ? [
            {
              url: product.heroImage,
              alt: `${product.name} - Cut N Stitch Apparel`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.heroImage ? [product.heroImage] : undefined,
    },
  };
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await loadProductData(slug);

  if (!product) {
    notFound();
  }

  const safeProduct = JSON.parse(JSON.stringify(product));

  const lowestPrice = safeProduct.pricing?.length
    ? Math.min(...safeProduct.pricing.map((p: any) => p.price))
    : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: safeProduct.name,
    description: safeProduct.description,
    image: safeProduct.heroImage
      ? `https://cutnstitchapparel.com${safeProduct.heroImage}`
      : undefined,
    category: safeProduct.category,
    brand: {
      "@type": "Brand",
      name: "Cut N Stitch Apparel",
    },
    offers: lowestPrice
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: lowestPrice,
          offerCount: safeProduct.pricing.length,
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
        name: safeProduct.name,
        item: `https://cutnstitchapparel.com/products/details/${slug}`,
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
        <ProductDetails product={safeProduct as any} />
      </main>
      <Footer />
    </>
  );
}
