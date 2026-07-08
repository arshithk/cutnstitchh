"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ProductDetail } from "@/data/products";
import GarmentColorPreview from "@/components/GarmentColorPreview";
import SizeSelector from "@/components/SizeSelector";
import PricingTable from "@/components/PricingTable";
import FeatureCards from "@/components/FeatureCards";
import StickyCTA from "@/components/StickyCTA";
import RelatedProducts from "@/components/RelatedProducts";
import ProductInfo from "@/components/ProductInfo";
import CTASection from "@/components/CTASection";

interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState("Yellow");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");

  useEffect(() => {
    setSelectedColor("Yellow");
    setSelectedSize(product.sizes[0] ?? "");
  }, [product.slug]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <GarmentColorPreview
          imagePath={product.heroImage}
          colors={product.colors}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          inquiryOnly={product.inquiryOnly}
          productSlug={product.slug}
          productName={product.name}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <ProductInfo product={product} />

          {!product.inquiryOnly ? (
            <div className="mt-8">
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            </div>
          ) : null}

          <CTASection productName={product.name} inquiryOnly={product.inquiryOnly} />
        </motion.div>
      </div>

      {!product.inquiryOnly ? (
        <>
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
                <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
                <p className="mt-2 text-sm leading-6 text-muted-custom">
                  Transparent MOQ-based pricing designed for B2B buyers and procurement teams.
                </p>
                <div className="mt-6">
                  <PricingTable pricing={product.pricing} />
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-semibold text-foreground">Feature Highlights</h2>
              <p className="mt-2 text-sm leading-6 text-muted-custom">
                Built for premium apparel manufacturing with a luxury experience from first glance to final dispatch.
              </p>
              <div className="mt-6">
                <FeatureCards features={product.features} />
              </div>
            </div>
          </div>

          <StickyCTA productName={product.name} />
          <RelatedProducts slugs={product.relatedSlugs} />
        </>
      ) : null}
    </div>
  );
}
