import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { HeroModelProvider } from "@/context/HeroModelContext";
import TextileSimulation from "@/components/TextileSimulation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollNavigation from "@/components/ScrollNavigation";

import { MASTER_GLOBAL_KEYWORDS, ORGANIZATION_KNOWS_ABOUT } from "@/lib/seoKeywords";

export const metadata: Metadata = {
  metadataBase: new URL("https://cutnstitchapparel.com"),
  title: {
    default: "B2B Apparel & Custom Clothing Manufacturer in Tiruppur | Cut N Stitch Apparel",
    template: "%s | Cut N Stitch Apparel",
  },
  description:
    "Cut N Stitch Apparel is a Tiruppur-based apparel manufacturer offering custom T-shirts, bulk clothing production and premium garment manufacturing solutions for fashion brands, startups and corporate businesses across India, including Bangalore.",
  keywords: MASTER_GLOBAL_KEYWORDS,
  authors: [{ name: "Cut N Stitch Apparel", url: "https://cutnstitchapparel.com" }],
  creator: "Cut N Stitch Apparel",
  publisher: "Cut N Stitch Apparel",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "B2B Apparel & Custom Clothing Manufacturer in Tiruppur | Cut N Stitch Apparel",
    description:
      "Cut N Stitch Apparel is a Tiruppur-based apparel manufacturer offering custom T-shirts, bulk clothing production and premium garment manufacturing solutions for fashion brands, startups and corporate businesses across India, including Bangalore.",
    url: "https://cutnstitchapparel.com",
    siteName: "Cut N Stitch Apparel",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg",
        width: 1536,
        height: 1024,
        alt: "Cut N Stitch Apparel - Premium B2B Apparel Manufacturing in Tiruppur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Apparel & Custom Clothing Manufacturer in Tiruppur | Cut N Stitch Apparel",
    description:
      "Cut N Stitch Apparel is a Tiruppur-based apparel manufacturer offering custom T-shirts, bulk clothing production and premium garment manufacturing solutions for fashion brands, startups and corporate businesses across India, including Bangalore.",
    images: ["https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cut N Stitch Apparel",
  url: "https://cutnstitchapparel.com",
  logo: "https://cutnstitchapparel.com/images/cut-n-stitch-logo.png",
  image: "https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg",
  description:
    "Cut N Stitch Apparel is a Tiruppur-based apparel manufacturer offering custom T-shirts, bulk clothing production and premium garment manufacturing solutions for fashion brands, startups and corporate businesses across India, including Bangalore.",
  keywords: MASTER_GLOBAL_KEYWORDS.slice(0, 30).join(", "),
  knowsAbout: ORGANIZATION_KNOWS_ABOUT,
  sameAs: [
    "https://www.instagram.com/cutnstitchapparel?stkn=MW9yemN2dm9xMW9lbA==",
    "https://www.facebook.com/share/1ceqrM5rX6/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 99444 66311",
    contactType: "sales",
    areaServed: ["IN", "Worldwide", "US", "GB", "AE"],
    availableLanguage: ["English", "Hindi", "Tamil", "Kannada"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Cut N Stitch Apparel",
  image: "https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg",
  logo: "https://cutnstitchapparel.com/images/cut-n-stitch-logo.png",
  url: "https://cutnstitchapparel.com",
  telephone: "+91 99444 66311",
  email: "vidhyashankar@cutnstitchapparel.com",
  priceRange: "$$",
  currenciesAccepted: "INR, USD, EUR, GBP",
  paymentAccepted: "Cash, Credit Card, Bank Transfer, UPI",
  address: {
    "@type": "PostalAddress",
    streetAddress: "339/2, Thilaga Nagar, Anupparapalayam",
    addressLocality: "Tiruppur",
    addressRegion: "Tamil Nadu",
    postalCode: "641652",
    addressCountry: "IN",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Tiruppur",
    },
    {
      "@type": "City",
      name: "Bangalore",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
  knowsAbout: ORGANIZATION_KNOWS_ABOUT,
  keywords: MASTER_GLOBAL_KEYWORDS.slice(0, 30).join(", "),
  description:
    "Cut N Stitch Apparel is a Tiruppur-based apparel manufacturer offering custom T-shirts, bulk clothing production and premium garment manufacturing solutions for fashion brands, startups and corporate businesses across India, including Bangalore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18425343698"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-18425343698');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="relative min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <HeroModelProvider>
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-transparent">
              <TextileSimulation />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,156,114,0.08),transparent_45%)]" />
            </div>

            <div className="relative z-10">
              {children}
              <FloatingWhatsApp />
              <ScrollNavigation />
            </div>
          </HeroModelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}