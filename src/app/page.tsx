import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatisticsSection from "@/components/StatisticsSection";
import About from "@/components/About";
import IndustriesServed from "@/components/IndustriesServed";
import ProductCategories from "@/components/ProductCategories";
import ProcessTimeline from "@/components/ProcessTimeline";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cut N Stitch Apparel",
  url: "https://cutnstitchapparel.com",
  description:
    "B2B custom apparel and clothing manufacturer in Bangalore, India. Low MOQ, private label clothing manufacturing, bulk T-shirts, polo shirts, and uniforms.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://cutnstitchapparel.com/products?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is your Minimum Order Quantity (MOQ)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our standard Minimum Order Quantity (MOQ) is 100 pieces per style/color. For sports jerseys or custom cut-and-sew activewear, the MOQ is 150 pieces. This helps startups launch collections without heavy upfront inventory liabilities.",
      },
    },
    {
      "@type": "Question",
      name: "What is the typical production lead time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bulk production takes 15 to 25 calendar days depending on order size and complexity. This timeline starts once the pre-production sample is approved by you and the advance deposit is received.",
      },
    },
    {
      "@type": "Question",
      name: "How do you calculate pricing for custom apparel runs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our direct manufacturing pricing depends on four main variables: (1) Garment style, (2) Fabric choice and GSM, (3) Customization branding requirements, and (4) Total order quantity. Larger volume runs benefit from economies of scale.",
      },
    },
    {
      "@type": "Question",
      name: "What fabric blends and GSM weights are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a wide catalog: 100% Combed Cotton, Organic Cotton, Poly-Cotton blends, Pique Honeycomb (Polos), French Terry, Loopknit, and Lycra-Spandex sports blends. Weights range from lightweight summer sinkers (160-180 GSM) to heavyweight oversized tees (220-280 GSM) and premium activewear bases. Custom dyeing is also available for specific Pantone shades.",
      },
    },
    {
      "@type": "Question",
      name: "What print styles and branding options do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We do Screen Printing, Puff/3D Printing, High-Density Embroidery, Chenille patches, DTF (Direct to Film) Printing, and Heat Transfer sublimations. We also manage private-labeling assets like custom woven neck labels, satin wash cares, printed sizes, and custom-branded eco-poly bags.",
      },
    },
    {
      "@type": "Question",
      name: "Do you ship PAN India/Overseas? What are the logistics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we ship PAN India/Overseas. We have contracted courier partners (Gati, Delhivery, V-Trans) offering door-to-door delivery across all major states, cities, and ports. International container shipping is also supported for global export clients.",
      },
    },
    {
      "@type": "Question",
      name: "Can we order a physical sample before bulk production?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Sampling is a key stage of our workflow. We create a physical pre-production sample using your exact tech specs and prints for fitment, fabric feel, and detailing check. A nominal sample fee applies, which is adjusted/refunded in full upon placing the subsequent bulk production order.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Header />

      <main>
        <Hero />
        <StatisticsSection />
        <About />
        <IndustriesServed />
        <ProductCategories />
        <ProcessTimeline />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  );
}