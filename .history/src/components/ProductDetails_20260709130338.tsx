"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ProductDetail } from "@/data/products";
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

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id ?? "");
  const [selectedColor, setSelectedColor] = useState("Yellow");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");

  const activeVariant = useMemo(() => {
    return product.variants?.find((variant) => variant.id === selectedVariantId) ?? product.variants?.[0];
  }, [product.variants, selectedVariantId]);

  const displayProduct = useMemo<ProductDetail>(() => {
    if (!activeVariant) {
      return product;
    }

    return {
      ...product,
      description: activeVariant.description ?? product.description,
      moq: activeVariant.moq ?? product.moq,
      fabric: activeVariant.fabric ?? product.fabric,
      gsmRange: activeVariant.gsmRange ?? product.gsmRange,
      heroImage: activeVariant.heroImage ?? product.heroImage,
      colors: activeVariant.colors?.length ? activeVariant.colors : product.colors,
      sizes: activeVariant.sizes?.length ? activeVariant.sizes : product.sizes,
      pricing: activeVariant.pricing?.length ? activeVariant.pricing : product.pricing,
    };
  }, [activeVariant, product]);

  useEffect(() => {
    const firstVariant = product.variants?.[0];
    setSelectedVariantId(firstVariant?.id ?? "");
    setSelectedColor(firstVariant?.colors?.[0]?.name ?? product.colors[0]?.name ?? "Yellow");
    setSelectedSize(firstVariant?.sizes?.[0] ?? product.sizes[0] ?? "");
  }, [product.slug, product.colors, product.sizes, product.variants]);

  const handleVariantSelect = (variantId: string) => {
    const nextVariant = product.variants?.find((variant) => variant.id === variantId) ?? product.variants?.[0];

    setSelectedVariantId(variantId);
    setSelectedColor(nextVariant?.colors?.[0]?.name ?? product.colors[0]?.name ?? "Yellow");
    setSelectedSize(nextVariant?.sizes?.[0] ?? product.sizes[0] ?? "");
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <GarmentColorPreview
            imagePath={displayProduct.heroImage}
            colors={displayProduct.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            inquiryOnly={product.inquiryOnly}
            productSlug={product.slug}
            productName={product.name}
          />

          {!product.inquiryOnly && product.variants && product.variants.length > 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">
                Available Variants
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-custom">
                Compare fabric and GSM options for the same product line without leaving the page.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.variants.map((variant) => {
                  const isActive = activeVariant?.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleVariantSelect(variant.id)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-200 ${isActive ? "border-accent-custom/70 bg-accent-custom/10 shadow-[0_0_0_1px_rgba(212,175,55,0.25)]" : "border-white/10 bg-white/5 hover:border-accent-custom/50 hover:bg-white/10"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                            <Image
                              src={normalizeImageSrc(variant.thumbnailImage ?? variant.heroImage ?? product.heroImage)}
                              alt={variant.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{variant.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent-custom">{variant.gsmRange}</p>
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-accent-custom" />
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm font-medium text-foreground/90">{variant.fabric}</p>
                        <p className="text-sm leading-6 text-muted-custom">{variant.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-4xl border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <ProductInfo product={displayProduct} />

          {!product.inquiryOnly ? (
            <div className="mt-8">
              <SizeSelector sizes={displayProduct.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            </div>
          ) : null}

          <CTASection productName={displayProduct.name} inquiryOnly={product.inquiryOnly} />
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
                  <PricingTable pricing={displayProduct.pricing} />
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

          <RelatedProducts slugs={product.relatedSlugs} />
        </>
      ) : null}
    </div>
  );
}
