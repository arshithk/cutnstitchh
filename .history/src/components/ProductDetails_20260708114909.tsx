"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Sparkles } from "lucide-react";
import type { ProductDetail } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import SizeSelector from "@/components/SizeSelector";
import PricingTable from "@/components/PricingTable";
import FeatureCards from "@/components/FeatureCards";
import StickyCTA from "@/components/StickyCTA";
import RelatedProducts from "@/components/RelatedProducts";

interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");

  const selectedColorMeta = useMemo(
    () => product.colors.find((color) => color.name === selectedColor) ?? product.colors[0],
    [product.colors, selectedColor],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <ProductGallery colors={product.colors} selectedColor={selectedColor} onColorSelect={setSelectedColor} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent-custom/30 bg-accent-custom/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-custom">
              {product.category}
            </span>
            {product.premiumQuality ? (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Premium Quality
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-muted-custom">{product.tagline}</p>
          <p className="mt-4 text-base leading-7 text-foreground/90">{product.description}</p>

          <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">MOQ</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{product.moq}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Fabric</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{product.fabric}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">GSM</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{product.gsmRange}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-custom">Delivery</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{product.deliveryTimeline}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-accent-custom/20 bg-accent-custom/10 px-4 py-3 text-sm text-accent-custom">
              <CheckCircle2 className="h-5 w-5" />
              Available for Bulk Manufacturing
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-custom">
              <Clock3 className="h-5 w-5 text-accent-custom" />
              Premium dispatch workflow for repeat and seasonal B2B orders
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">
              <Sparkles className="h-4 w-4" />
              Available Sizes
            </div>
            <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
          </div>
        </motion.div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
            <p className="mt-2 text-sm leading-6 text-muted-custom">
              Transparent MOQ-based pricing designed for B2B buyers and procurement teams.
            </p>
            <div className="mt-6">
              <PricingTable pricing={product.pricing} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
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
    </div>
  );
}
