import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import TextileSimulation from "@/components/TextileSimulation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollNavigation from "@/components/ScrollNavigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://cutnstitchapparel.com"),
  title: {
    default: "Cut N Stitch Apparel | B2B Clothing & T-Shirt Manufacturer in Bangalore",
    template: "%s | Cut N Stitch Apparel",
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
  openGraph: {
    title: "Cut N Stitch Apparel | B2B Clothing & T-Shirt Manufacturer in Bangalore",
    description:
      "Cut N Stitch Apparel is a premier B2B custom clothing & apparel manufacturer in Bangalore, India. Low MOQ, private label manufacturing, bulk T-shirts, polo shirts, hoodies, corporate uniforms, and custom merchandise.",
    url: "https://cutnstitchapparel.com",
    siteName: "Cut N Stitch Apparel",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/cut-n-stitch-apparel.jpeg",
        width: 1200,
        height: 630,
        alt: "Cut N Stitch Apparel - B2B Apparel Manufacturer in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cut N Stitch Apparel | B2B Clothing & T-Shirt Manufacturer in Bangalore",
    description:
      "Cut N Stitch Apparel is a premier B2B custom clothing & apparel manufacturer in Bangalore, India. Low MOQ, private label manufacturing, and custom merchandise.",
    images: ["/images/cut-n-stitch-apparel.jpeg"],
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
  logo: "https://cutnstitchapparel.com/images/cut-n-stitch-apparel.jpeg",
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