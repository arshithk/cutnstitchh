"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ProductDetail, ProductVariant } from "@/data/products";
import GarmentColorPreview from "@/components/GarmentColorPreview";
import RelatedProducts from "@/components/RelatedProducts";
import ProductInfo from "@/components/ProductInfo";
import CTASection from "@/components/CTASection";

interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  // selectedVariant is null when no specific variant is active (show product-level colors)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  );

  // Colors come from the active variant, falling back to product-level colors
  const displayColors = useMemo(
    () => (selectedVariant?.colors.length ? selectedVariant.colors : product.colors),
    [selectedVariant, product.colors],
  );

  const [selectedColor, setSelectedColor] = useState(displayColors[0]?.name ?? "White");

  const selectedColorData = useMemo(
    () => displayColors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase()) ?? displayColors[0],
    [displayColors, selectedColor],
  );

  // Hero image: use the selected color's image, or variant heroImage, or product heroImage
  const displayHeroImage = useMemo(
    () => selectedColorData?.imagePath ?? selectedVariant?.heroImage ?? product.heroImage,
    [selectedColorData, selectedVariant, product.heroImage],
  );

  // When the variant changes, reset selectedColor to the first color of the new variant
  useEffect(() => {
    setSelectedColor(displayColors[0]?.name ?? "White");
  }, [displayColors]);

  // Guard: if the current selectedColor isn't in the new colors list, reset it
  useEffect(() => {
    if (!displayColors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())) {
      setSelectedColor(displayColors[0]?.name ?? "White");
    }
  }, [displayColors, selectedColor]);

  const selectedColorHex = selectedColorData?.hex ?? "#d4af37";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={{ backgroundColor: "#05070c" }}>
      <div className="grid gap-10 lg:grid-cols-[55%_45%] lg:items-start">
        <div className="space-y-8">
          <div>
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground transition hover:border-white/30 hover:bg-white/10"
              aria-label="Go back home"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <GarmentColorPreview
            imagePath={displayHeroImage}
            colors={displayColors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            inquiryOnly={product.inquiryOnly}
            productSlug={product.slug}
            productName={product.name}
            selectedColorHex={selectedColorHex}
            fabric={selectedVariant?.fabric ?? product.fabric}
            gsmRange={selectedVariant?.gsmRange ?? product.gsmRange}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[36px] border border-white/10 bg-black/35 p-6 shadow-[0_26px_95px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
          />

          <div className="mt-10">
            <CTASection productName={product.name} inquiryOnly={product.inquiryOnly} />
          </div>
        </motion.div>
      </div>

      {!product.inquiryOnly ? <RelatedProducts slugs={product.relatedSlugs} /> : null}
    </div>
  );
}

