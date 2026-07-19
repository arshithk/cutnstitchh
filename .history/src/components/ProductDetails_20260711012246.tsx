"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ProductDetail, ProductVariant } from "@/data/products";
import GarmentColorPreview from "@/components/GarmentColorPreview";
import PricingTable from "@/components/PricingTable";
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

  // Hero image: use variant's first color image, or variant heroImage, or product heroImage
  const displayHeroImage = useMemo(
    () => selectedVariant?.colors[0]?.imagePath ?? selectedVariant?.heroImage ?? product.heroImage,
    [selectedVariant, product.heroImage],
  );

  const [selectedColor, setSelectedColor] = useState(displayColors[0]?.name ?? "White");

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

  const selectedColorData = useMemo(
    () => displayColors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase()) ?? displayColors[0],
    [displayColors, selectedColor],
  );

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

          {!product.inquiryOnly ? (
            <div className="rounded-4xl border border-white/10 bg-black/40 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Pricing Table</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">Bulk pricing made premium</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-custom">Structured MOQ pricing for procurement teams with a refined visual hierarchy.</p>
                </div>

                <PricingTable pricing={selectedVariant?.pricing ?? product.pricing} />
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


interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "Yellow");

  const displayProduct = useMemo<ProductDetail>(() => product, [product]);

  const selectedColorData = useMemo(() => {
    return displayProduct.colors.find((color) => color.name.toLowerCase() === selectedColor.toLowerCase()) ?? displayProduct.colors[0];
  }, [displayProduct.colors, selectedColor]);

  const selectedColorHex = selectedColorData?.hex ?? displayProduct.colors[0]?.hex ?? "#d4af37";

  useEffect(() => {
    setSelectedColor(product.colors[0]?.name ?? "Yellow");
  }, [product.colors]);

  useEffect(() => {
    if (!displayProduct.colors.some((color) => color.name.toLowerCase() === selectedColor.toLowerCase())) {
      setSelectedColor(displayProduct.colors[0]?.name ?? "Yellow");
    }
  }, [displayProduct.colors, selectedColor]);


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
            imagePath={displayProduct.heroImage}
            colors={displayProduct.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            inquiryOnly={product.inquiryOnly}
            productSlug={product.slug}
            productName={product.name}
            selectedColorHex={selectedColorHex}
            fabric={displayProduct.fabric}
            gsmRange={displayProduct.gsmRange}
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
