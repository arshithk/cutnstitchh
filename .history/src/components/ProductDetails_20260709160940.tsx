"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { ProductDetail } from "@/data/products";
import GarmentColorPreview from "@/components/GarmentColorPreview";
import PricingTable from "@/components/PricingTable";
import RelatedProducts from "@/components/RelatedProducts";
import ProductInfo from "@/components/ProductInfo";
import CTASection from "@/components/CTASection";

interface ProductDetailsProps {
  product: ProductDetail;
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const fullHex = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const value = Number.parseInt(fullHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "Yellow");

  const displayProduct = useMemo<ProductDetail>(() => product, [product]);

  const selectedColorData = useMemo(() => {
    return displayProduct.colors.find((color) => color.name.toLowerCase() === selectedColor.toLowerCase()) ?? displayProduct.colors[0];
  }, [displayProduct.colors, selectedColor]);

  const selectedColorHex = selectedColorData?.hex ?? displayProduct.colors[0]?.hex ?? "#d4af37";
  const pageBackgroundStyle = useMemo(() => ({
    backgroundColor: selectedColorData ? selectedColorHex : "#10131a",
    backgroundImage: selectedColorData
      ? `radial-gradient(circle at top left, ${hexToRgba(selectedColorHex, 0.24)} 0%, transparent 42%), linear-gradient(135deg, ${hexToRgba(selectedColorHex, 0.16)} 0%, rgba(5, 8, 16, 0.96) 60%)`
      : "none",
  }), [selectedColorHex, selectedColorData]);

  useEffect(() => {
    setSelectedColor(product.colors[0]?.name ?? "Yellow");
  }, [product.colors]);

  useEffect(() => {
    if (!displayProduct.colors.some((color) => color.name.toLowerCase() === selectedColor.toLowerCase())) {
      setSelectedColor(displayProduct.colors[0]?.name ?? "Yellow");
    }
  }, [displayProduct.colors, selectedColor]);


  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={pageBackgroundStyle}>
      <div className="grid gap-10 lg:grid-cols-[55%_45%] lg:items-start">
        <div className="space-y-8">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:border-white/30 hover:bg-white/10"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Back
            </button>
          </div>

          <GarmentColorPreview
            imagePath={displayProduct.heroImage}
            colors={displayProduct.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            inquiryOnly={product.inquiryOnly}
            productSlug={product.slug}
            productName={product.name}
            selectedColorHex={selectedColorHex}
          />

          {!product.inquiryOnly ? (
            <div className="rounded-4xl border border-white/10 bg-black/40 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Pricing Table</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">Bulk pricing made premium</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-custom">Structured MOQ pricing for procurement teams with a refined visual hierarchy.</p>
                </div>

                <PricingTable pricing={displayProduct.pricing} />
              </div>
            </div>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[36px] border border-white/10 bg-black/35 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <ProductInfo product={displayProduct} />

          <div className="mt-10">
            <CTASection productName={displayProduct.name} inquiryOnly={product.inquiryOnly} />
          </div>
        </motion.div>
      </div>

      {!product.inquiryOnly ? <RelatedProducts slugs={product.relatedSlugs} /> : null}
    </div>
  );
}
