import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveStockPage from "@/components/LiveStockPage";

export const metadata: Metadata = {
  title: "Ready Live Stock Inventory in Bangalore",
  description:
    "Check real-time ready fabric and blank garment inventory in Bangalore for quick-turnaround bulk manufacturing, custom screen printing, and DTF embroidery.",
  alternates: {
    canonical: "/live-stock",
  },
  openGraph: {
    title: "Ready Live Stock Inventory | Cut N Stitch Apparel Bangalore",
    description:
      "Check real-time ready fabric and blank garment inventory in Bangalore for quick-turnaround bulk manufacturing.",
    url: "https://cutnstitchapparel.com/live-stock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready Live Stock Inventory | Cut N Stitch Apparel Bangalore",
    description:
      "Check real-time ready fabric and blank garment inventory in Bangalore for rapid bulk manufacturing.",
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
