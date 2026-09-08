import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCategories from "@/components/ProductCategories";

export const metadata: Metadata = {
  title: "B2B Apparel Catalog & Products",
  description:
    "Explore our B2B apparel manufacturing catalog: oversized T-shirts, polo shirts, regular fit tees, hoodies, sweatshirts, shorts, joggers, uniforms, and custom merchandise. Low MOQ, private label in Bangalore.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "B2B Apparel Catalog & Products | Cut N Stitch Apparel",
    description:
      "Explore our B2B apparel manufacturing catalog: oversized T-shirts, polo shirts, regular fit tees, hoodies, sweatshirts, shorts, joggers, uniforms, and custom merchandise.",
    url: "https://cutnstitchapparel.com/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Apparel Catalog & Products | Cut N Stitch Apparel",
    description:
      "Explore our wholesale B2B clothing catalog with low MOQs and premium garment finishes in Bangalore, India.",
  },
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
  ],
};

export default function ProductsPage() {
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
        <ProductCategories />
      </main>
      <Footer />
    </>
  );
}
