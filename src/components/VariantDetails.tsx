"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { CatalogVariant, ProductPricingTier } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";
import { getProductImageCandidates, normalizeColorName } from "@/lib/productImageMap";
import PricingTable from "@/components/PricingTable";
import SizeChartDropdown from "@/components/SizeChartDropdown";

interface VariantDetailsProps {
  categoryName: string;
  variant: CatalogVariant;
  pricing?: ProductPricingTier[];
}

function getDefaultVariantColorName(variant: CatalogVariant) {
  const normalizedHeroImage = normalizeImageSrc(variant.heroImage).toLowerCase();

  const heroMatchByImagePath = variant.colors.find((color) =>
    normalizeImageSrc(color.imagePath ?? variant.heroImage).toLowerCase() === normalizedHeroImage,
  );
  if (heroMatchByImagePath) {
    return heroMatchByImagePath.name;
  }

  const heroColorByName = variant.colors.find((color) => normalizedHeroImage.includes(normalizeColorName(color.name)));
  if (heroColorByName) {
    return heroColorByName.name;
  }

  const heroCandidateColor = variant.colors.find((color) => {
    const candidates = getProductImageCandidates(
      {
        categorySlug: variant.categorySlug,
        variantName: variant.name,
        variantSlug: variant.slug,
        fabric: variant.fabric,
        gsmRange: variant.gsm,
      },
      color.name,
    );
    return candidates.some((candidate) => candidate.toLowerCase() === normalizedHeroImage);
  });

  if (heroCandidateColor) {
    return heroCandidateColor.name;
  }

  const firstNonWhiteColor = variant.colors.find(
    (color) => !["white", "off-white"].includes(color.name.toLowerCase()),
  );

  return firstNonWhiteColor?.name ?? variant.colors[0]?.name ?? "White";
}

export default function VariantDetails({ categoryName, variant, pricing = [] }: VariantDetailsProps) {
  const pricingSourceText = variant.pricingSource ? `Pricing source: ${variant.pricingSource}` : "";
  const [selectedColor, setSelectedColor] = useState(getDefaultVariantColorName(variant));

  const activeColor =
    variant.colors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase()) ??
    variant.colors[0];

  const previewImage = activeColor?.imagePath ?? variant.heroImage;
  const isJoggersPreview = previewImage.toLowerCase().includes("/images/joggers-") || previewImage.toLowerCase().includes("/images/lycra-joggers-");

  const rawFabric = variant.fabric;

  let pillFabricText = rawFabric;
  let gridFabricText = rawFabric;

  if (rawFabric.toLowerCase().includes("100% cotton s-jersey")) {
    pillFabricText = rawFabric.replace(/100% Cotton S-Jersey/gi, "Elite Cotton");
    gridFabricText = rawFabric.replace(/100% Cotton S-Jersey/gi, "S/Jersey");
  } else if (rawFabric.toLowerCase().includes("100% cotton piqué") || rawFabric.toLowerCase().includes("100% cotton pique")) {
    pillFabricText = rawFabric.replace(/100% Cotton Piqu[é|e]/gi, "Elite Cotton");
    gridFabricText = rawFabric.replace(/100% Cotton Piqu[é|e]/gi, "Airtex");
  } else if (rawFabric.toLowerCase().includes("premium cotton piqué") || rawFabric.toLowerCase().includes("premium cotton pique")) {
    pillFabricText = rawFabric.replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton (Bio Washed)");
    gridFabricText = rawFabric.replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton Airtex");
  } else if (rawFabric.toLowerCase() === "dri fit mars") {
    pillFabricText = "Dri Fit Mars Polyester";
  } else if (rawFabric.toLowerCase().includes("dot knit polyester")) {
    gridFabricText = rawFabric.replace(/Dot Knit Polyester/gi, "Dot Knit");
  } else if (rawFabric.toLowerCase().includes("honeycomb knit polyester")) {
    gridFabricText = rawFabric.replace(/Honeycomb Knit Polyester/gi, "Honeycomb Knit");
  } else if (rawFabric.toLowerCase().includes("saleena knit polyester")) {
    gridFabricText = rawFabric.replace(/Saleena Knit Polyester/gi, "Saleena Knit");
  } else if (rawFabric.toLowerCase().includes("polyester with 2-way stretch lycra")) {
    gridFabricText = rawFabric.replace(/Polyester with 2-Way Stretch Lycra/gi, "2-Way Stretch Lycra");
  } else if (rawFabric.toLowerCase().includes("polyester with 4-way stretch lycra")) {
    gridFabricText = rawFabric.replace(/Polyester with 4-Way Stretch Lycra/gi, "4-Way Stretch Lycra");
  }

  const displayDescription = variant.description
    .replace(/100% Cotton S-Jersey/gi, "Elite Cotton")
    .replace(/100% Cotton Piqu[é|e]/gi, "Elite Cotton")
    .replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton (Bio Washed)");

  const detailItems = [
    { label: "MOQ", value: variant.moq },
    { label: "Fabric", value: gridFabricText },
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
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-custom">{displayDescription}</p>
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
            className="overflow-hidden rounded-4xl border border-border-custom/70 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          >
            <div
              className="relative aspect-3/4 w-full"
              style={{
                backgroundColor: activeColor?.hex ?? "#1a1a2e",
                transition: "background-color 0.35s ease",
              }}
            >
              <Image
                src={normalizeImageSrc(previewImage)}
                alt={`${activeColor?.name ?? variant.name} preview`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 55vw"
                priority
                className={`${isJoggersPreview ? "object-contain" : "object-cover"} object-center`}
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
            <div className="rounded-4xl border border-border-custom/70 bg-card/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
              <div className="mb-6 flex items-center gap-2 text-accent-custom">
                <Sparkles size={18} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em]">Select Colour</h2>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
                {variant.colors.map((color) => {
                  const isSelected = activeColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`group rounded-3xl border-2 p-3 text-left transition-all duration-300 hover:shadow-lg ${isSelected
                        ? "border-accent-custom shadow-[0_0_0_2px_rgba(212,175,55,0.3),0_0_45px_rgba(212,175,55,0.2)]"
                        : "border-border-custom/50 hover:border-accent-custom/70 hover:shadow-md"
                        }`}
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg">
                        <Image
                          src={normalizeImageSrc(color.imagePath || variant.heroImage)}
                          alt={`${color.name} swatch`}
                          fill
                          sizes="96px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span
                          className="h-5 w-5 rounded-full border-2 border-white/50 transition-transform duration-300 group-hover:scale-125 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-accent-custom">{color.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-5 rounded-2xl border-2 border-accent-custom/40 bg-linear-to-r from-accent-custom/15 to-accent-custom/5 px-4 py-3 text-sm font-semibold text-accent-custom shadow-sm"
              >
                ✓ Selected Colour: <span className="text-base">{activeColor?.name}</span>
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
              {pillFabricText}
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

          <SizeChartDropdown categoryName={categoryName} />

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
              <p className="mt-2 text-sm leading-7 text-muted-custom">
                {variant.productDescription != null
                  ? variant.productDescription
                    .replace(/100% Cotton S-Jersey/gi, "Elite Cotton")
                    .replace(/100% Cotton Piqu[é|e]/gi, "Elite Cotton")
                    .replace(/Premium Cotton Piqu[é|e]/gi, "Premium Cotton (Bio Washed)")
                  : ""}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#contact" className="rounded-full bg-accent-custom px-5 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110">
              Get Quote
            </Link>
            <Link href={`/products/${variant.categorySlug}`} className="rounded-full border border-border-custom/70 px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-foreground/5">
              Back to Variants
            </Link>
          </div>
          {pricing.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Pricing Table</p>
              {pricingSourceText && (
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-foreground/70">{pricingSourceText}</p>
              )}
              <PricingTable pricing={pricing} show3XLSurcharge={variant.categorySlug !== "joggers" && variant.categorySlug !== "shorts"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

