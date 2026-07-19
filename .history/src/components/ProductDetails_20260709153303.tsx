"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ProductDetail, ProductColor, ProductVariant } from "@/data/products";
import GarmentColorPreview from "@/components/GarmentColorPreview";
import SizeSelector from "@/components/SizeSelector";
import PricingTable from "@/components/PricingTable";
import FeatureCards from "@/components/FeatureCards";
import RelatedProducts from "@/components/RelatedProducts";
import ProductInfo from "@/components/ProductInfo";
import CTASection from "@/components/CTASection";
import { normalizeImageSrc } from "@/lib/image";

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
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "Yellow");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");

  const isTshirtProduct = ["oversized-t-shirts", "regular-fit-t-shirts", "polo-t-shirts"].includes(product.slug);

  const activeVariant = useMemo(() => {
    return product.variants?.find((variant) => variant.id === selectedVariantId) ?? product.variants?.[0];
  }, [product.variants, selectedVariantId]);

  const displayProduct = useMemo<ProductDetail>(() => {
    if (!activeVariant) {
      return product;
    }

    const colorMap = new Map<string, ProductColor>();

    for (const color of product.colors) {
      colorMap.set(color.name.toLowerCase(), color);
    }

    for (const color of activeVariant.colors ?? []) {
      colorMap.set(color.name.toLowerCase(), color);
    }

    const combinedColors = Array.from(colorMap.values());

    return {
      ...product,
      description: activeVariant.description ?? product.description,
      moq: activeVariant.moq ?? product.moq,
      fabric: activeVariant.fabric ?? product.fabric,
      gsmRange: activeVariant.gsmRange ?? product.gsmRange,
      heroImage: activeVariant.heroImage ?? product.heroImage,
      colors: combinedColors.length ? combinedColors : product.colors,
      sizes: activeVariant.sizes?.length ? activeVariant.sizes : product.sizes,
      pricing: activeVariant.pricing?.length ? activeVariant.pricing : product.pricing,
    };
  }, [activeVariant, product]);

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
    const firstVariant = product.variants?.[0];
    setSelectedVariantId(firstVariant?.id ?? "");
    setSelectedColor(firstVariant?.colors?.[0]?.name ?? product.colors[0]?.name ?? "Yellow");
    setSelectedSize(firstVariant?.sizes?.[0] ?? product.sizes[0] ?? "");
  }, [product.slug, product.colors, product.sizes, product.variants]);

  useEffect(() => {
    if (!displayProduct.colors.some((color) => color.name.toLowerCase() === selectedColor.toLowerCase())) {
      setSelectedColor(displayProduct.colors[0]?.name ?? "Yellow");
    }
  }, [displayProduct.colors, selectedColor]);

  const handleVariantSelect = (variantId: string) => {
    const nextVariant = product.variants?.find((variant) => variant.id === variantId) ?? product.variants?.[0];

    setSelectedVariantId(variantId);
    setSelectedColor(nextVariant?.colors?.[0]?.name ?? product.colors[0]?.name ?? "Yellow");
    setSelectedSize(nextVariant?.sizes?.[0] ?? product.sizes[0] ?? "");
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8" style={pageBackgroundStyle}>
      <div className="grid gap-10 lg:grid-cols-[55%_45%] lg:items-start">
        <div className="space-y-8">
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
            <div className="rounded-[32px] border border-white/10 bg-black/40 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
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

          <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-[0_24px_72px_rgba(0,0,0,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-custom">MOQ</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">{displayProduct.moq}</p>
            <p className="mt-4 text-sm leading-6 text-muted-custom">Minimum order quantity is optimized for wholesale apparel sourcing and reliable volume production.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[36px] border border-white/10 bg-black/35 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <ProductInfo
            product={displayProduct}
            variants={product.variants}
            activeVariant={activeVariant}
            showVariantCards={isTshirtProduct}
          />

          <div className="mt-10">
            <CTASection productName={displayProduct.name} inquiryOnly={product.inquiryOnly} />
          </div>
        </motion.div>
      </div>

      {!product.inquiryOnly ? <RelatedProducts slugs={product.relatedSlugs} /> : null}
    </div>
  );
}
