"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { CatalogVariant } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";

interface VariantDetailsProps {
  categoryName: string;
  variant: CatalogVariant;
}

export default function VariantDetails({ categoryName, variant }: VariantDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(variant.colors[0]?.name ?? "White");

  const activeColor =
    variant.colors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase()) ??
    variant.colors[0];

  const previewImage = activeColor?.imagePath ?? variant.heroImage;

  const detailItems = [
    { label: "MOQ", value: variant.moq },
    { label: "Fabric", value: variant.fabric },
    { label: "GSM", value: variant.gsm },
    { label: "Fit", value: variant.fit },
    { label: "Sizes", value: variant.sizes.join(", ") },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href={`/products/${variant.categorySlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-custom transition hover:opacity-80">
            <ArrowLeft size={16} />
            Back to Variants
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{variant.name}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-custom">{variant.description}</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-accent-custom/20 bg-accent-custom/10 px-4 py-2 text-sm font-semibold text-accent-custom">
          <Shirt size={16} />
          {categoryName}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: image + color selector */}
        <div className="flex flex-col gap-4">
          <motion.div
            key={previewImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden rounded-4xl border border-border-custom/70 bg-card/70 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          >
            <div className="relative aspect-[4/5] min-h-[360px] sm:min-h-[430px] lg:min-h-[520px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(246,246,246,0.88)_58%,rgba(235,235,235,0.82))] p-4 sm:p-5 lg:p-6">
              <Image
                src={normalizeImageSrc(previewImage)}
                alt={`${activeColor?.name ?? variant.name} preview`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 55vw"
                priority
                className="object-contain"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== normalizeImageSrc(variant.heroImage)) {
                    img.src = normalizeImageSrc(variant.heroImage);
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Colour selector */}
          {variant.colors.length > 0 && (
            <div className="rounded-4xl border border-border-custom/70 bg-card/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
              <div className="mb-4 flex items-center gap-2 text-accent-custom">
                <Sparkles size={16} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em]">Select Colour</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {variant.colors.map((color) => {
                  const isSelected = activeColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-accent-custom bg-accent-custom/10 text-accent-custom shadow-[0_0_0_1px_rgba(212,175,55,0.3)]"
                          : "border-border-custom/70 bg-white/3 text-foreground hover:border-accent-custom/50 hover:bg-white/8"
                      }`}
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-3 text-sm text-accent-custom font-medium"
              >
                Selected: {activeColor?.name}
              </motion.div>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="rounded-4xl border border-border-custom/70 bg-card/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-accent-custom/20 bg-accent-custom/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent-custom">
              {variant.gsm}
            </span>
            <span className="rounded-full border border-border-custom/70 px-3 py-1 text-xs font-medium text-muted-custom">
              {variant.fabric}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border-custom/60 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-custom">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Printing Compatibility</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.printingCompatibility}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Embroidery Compatibility</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.embroideryCompatibility ?? "Embroidery compatibility is available on request for this fabric and finish."}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-custom">Product Description</h2>
              <p className="mt-2 text-sm leading-7 text-muted-custom">{variant.productDescription}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-full bg-accent-custom px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110">
              Get Quote
            </button>
            <Link href={`/products/${variant.categorySlug}`} className="rounded-full border border-border-custom/70 px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-foreground/5">
              Back to Variants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

