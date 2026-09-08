import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import TextileSimulation from "@/components/TextileSimulation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollNavigation from "@/components/ScrollNavigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://cutnstitchapparel.com"),
  title: {
    default: "Cut n Stitch Apparel | Premium B2B Apparel Manufacturing",
    template: "%s | Cut n Stitch Apparel",
  },
  description:
    "Cut N Stitch Apparel is a premier B2B custom clothing & apparel manufacturer in Bangalore, India. Low MOQ, private label manufacturing, bulk T-shirts, polo shirts, hoodies, corporate uniforms, and custom merchandise.",
  keywords: [
    "apparel manufacturer in Bangalore",
    "clothing manufacturer in Bangalore",
    "T-shirt manufacturer in Bangalore",
    "custom apparel manufacturer India",
    "custom T-shirt manufacturer India",
    "oversized T-shirt manufacturer",
    "polo T-shirt manufacturer",
    "hoodie manufacturer India",
    "corporate uniform manufacturer",
    "custom merchandise manufacturer",
    "private label clothing manufacturer India",
    "bulk T-shirt manufacturer",
  ],
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
    title: "Cut n Stitch Apparel | Premium B2B Apparel Manufacturing",
    description:
      "Cut N Stitch Apparel is a premier B2B custom clothing & apparel manufacturer in Bangalore, India. Low MOQ, private label manufacturing, bulk T-shirts, polo shirts, hoodies, corporate uniforms, and custom merchandise.",
    url: "https://cutnstitchapparel.com",
    siteName: "Cut N Stitch Apparel",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg",
        width: 1536,
        height: 1024,
        alt: "Cut n Stitch Apparel - Premium B2B Apparel Manufacturing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cut n Stitch Apparel | Premium B2B Apparel Manufacturing",
    description:
      "Cut N Stitch Apparel is a premier B2B custom clothing & apparel manufacturer in Bangalore, India. Low MOQ, private label manufacturing, and custom merchandise.",
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
  sameAs: [
    "https://instagram.com",
    "https://linkedin.com",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 99444 66311",
    contactType: "sales",
    areaServed: ["IN", "Worldwide"],
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
  email: "info@cutnstitch.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "339/2, Thilaga Nagar, Anupparapalayam",
    addressLocality: "Tirupur",
    addressRegion: "Tamil Nadu",
    postalCode: "641652",
    addressCountry: "IN",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Bangalore",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
  description:
    "B2B apparel and custom clothing manufacturer in Bangalore and Tirupur, India. Providing bulk T-shirts, polo shirts, oversized tees, hoodies, and corporate uniforms.",
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
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-transparent">
            <TextileSimulation />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,156,114,0.08),transparent_45%)]" />
          </div>

          <div className="relative z-10">
            {children}
            <FloatingWhatsApp />
            <ScrollNavigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}