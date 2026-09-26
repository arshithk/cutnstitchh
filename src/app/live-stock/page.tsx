import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveStockPage from "@/components/LiveStockPage";

import { CATEGORY_KEYWORDS, MASTER_GLOBAL_KEYWORDS } from "@/lib/seoKeywords";

export const metadata: Metadata = {
  title: "Ready Stock Plain T-Shirts & Blank Garments Bangalore | Live Inventory",
  description:
    "Check live stock inventory of ready plain t-shirts, oversized tees, polo shirts & hoodies in Bangalore. Instant dispatch, ready for custom screen printing & DTF embroidery.",
  keywords: [...CATEGORY_KEYWORDS["live-stock"], ...MASTER_GLOBAL_KEYWORDS.slice(0, 15)],
  alternates: {
    canonical: "/live-stock",
  },
  openGraph: {
    title: "Ready Stock Plain T-Shirts & Blank Garments Bangalore | Live Inventory",
    description:
      "Check real-time ready fabric and blank garment inventory in Bangalore for quick-turnaround bulk manufacturing, custom screen printing, and DTF embroidery.",
    url: "https://cutnstitchapparel.com/live-stock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready Stock Plain T-Shirts Bangalore | Cut N Stitch Apparel",
    description:
      "Check real-time ready fabric and blank garment inventory in Bangalore for rapid bulk manufacturing and same-day dispatch.",
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
      name: "Live Stock",
      item: "https://cutnstitchapparel.com/live-stock",
    },
  ],
};

export default function LiveStockRoutePage() {
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
        <LiveStockPage />
      </main>
      <Footer />
    </>
  );
}
