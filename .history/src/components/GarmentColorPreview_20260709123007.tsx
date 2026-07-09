"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";

interface GarmentColorPreviewProps {
  imagePath: string;
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  inquiryOnly?: boolean;
  productSlug?: string;
  productName?: string;
}

const getImagePath = (fileName: string) => `/images/${encodeURI(fileName)}`;

const productImagePrefixes: Record<string, string> = {
  "oversized-t-shirts": "oversized-tshirt",
  "regular-fit-t-shirts": "regular-fit-tshirt",
  "polo-t-shirts": "polo-tshirt",
  hoodies: "hoodie",
  sweatshirts: "sweatshirt",
  tracksuits: "tracksuits",
  shorts: "shorts",
  joggers: "joggers",
  "tank-tops": "tank-top",
};

const getProductImage = (productSlug: string, selectedColour: string) => {
  const prefix = productImagePrefixes[productSlug];

  if (!prefix) return "";

  const colour = selectedColour
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `/images/${prefix}-${colour}.jpg`;
};

const getVariantImage = (
  productSlug: string,
  productName: string,
  variant: ProductColor | undefined,
  fallbackImage: string,
) => {
  if (variant?.imagePath) {
    return variant.imagePath;
  }

  const prefix = getProductPrefix(productSlug, productName);

  if (!prefix) return fallbackImage;

  const colour = (variant?.name || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return colour ? `/images/${prefix}-${colour}.jpg` : fallbackImage;
};

const getProductPrefix = (productSlug = "", productName = "") => {
  const slug = productSlug.toLowerCase();

  if (productImagePrefixes[slug]) {
    return productImagePrefixes[slug];
  }

  return (productName || slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
};

export default function GarmentColorPreview({
  imagePath,
  colors,
  selectedColor,
  onColorSelect,
  inquiryOnly = false,
  productSlug = "",
  productName = "",
}: GarmentColorPreviewProps) {
  const [previewImage, setPreviewImage] = useState(imagePath);
  const [isImageReady, setIsImageReady] = useState(true);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<string, boolean>>({});

  const availableColors = useMemo(() => {
    return colors.filter((color) => color?.name).map((color) => color.name);
  }, [colors]);

  const activeColor = useMemo(() => {
    return availableColors.includes(selectedColor) ? selectedColor : availableColors[0] ?? "";
  }, [availableColors, selectedColor]);

  const activeVariant = useMemo(() => {
    return colors.find((color) => color.name === activeColor) ?? colors[0];
  }, [activeColor, colors]);

  useEffect(() => {
    const nextImage = getVariantImage(productSlug, productName, activeVariant, imagePath);
    setPreviewImage(nextImage || imagePath);
    setIsImageReady(true);
  }, [activeVariant, imagePath, productName, productSlug]);

  const handleImageError = () => {
    if (previewImage !== imagePath) {
      setPreviewImage(imagePath);
      setIsImageReady(true);
    }
  };

  const handleThumbnailError = (variantName: string) => {
    setThumbnailErrors((current) => ({ ...current, [variantName]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <motion.div
          key={activeColor}
          initial={{ opacity: 0.95, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-transparent"
        >
          <div className="mx-auto flex w-full max-w-112.5 items-center justify-center py-2 sm:py-3">
            <div className="group relative w-full max-w-112.5 overflow-hidden rounded-3xl border border-[#2b2b2b] bg-[#0f0f0f]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-3">
              <div className="relative aspect-4/5 w-full max-h-125 overflow-hidden rounded-[20px]">
                <motion.div
                  key={previewImage}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: isImageReady ? 1 : 0.65, scale: 1 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={normalizeImageSrc(previewImage)}
                    alt={`${activeColor} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    onError={handleImageError}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {!inquiryOnly && colors.length > 0 ? (
          <div className="w-full lg:w-28 xl:w-32">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-1 lg:gap-2">
              {colors.map((variant) => {
                const isSelected = activeColor === variant.name;
                const variantImage = getVariantImage(productSlug, productName, variant, imagePath);
                const hasThumbnailError = thumbnailErrors[variant.name];

                return (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => onColorSelect(variant.name)}
                    className={`group rounded-2xl border p-1.5 text-left transition-all duration-200 ${isSelected ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_0_2px_rgba(212,175,55,0.2)]" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/60 hover:bg-white/10"}`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
                      {hasThumbnailError ? (
                        <div className="flex h-full items-center justify-center" style={{ backgroundColor: variant.hex }}>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">{variant.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={normalizeImageSrc(variantImage)}
                          alt={`${variant.name} thumbnail`}
                          fill
                          sizes="(max-width: 768px) 25vw, 96px"
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                          onError={() => handleThumbnailError(variant.name)}
                        />
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-1">
                      <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ backgroundColor: variant.hex }} />
                      <span className="truncate text-[11px] font-medium text-foreground">{variant.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {!inquiryOnly && colors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {colors.map((variant) => {
              const isSelected = activeColor === variant.name;
              return (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => onColorSelect(variant.name)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${isSelected ? "border-accent-custom bg-accent-custom text-black shadow-[0_0_0_2px_rgba(212,175,55,0.25)]" : "border-white/15 bg-white/5 text-foreground hover:border-accent-custom/60"}`}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-accent-custom/30 bg-accent-custom/10 px-4 py-3 text-sm font-medium text-accent-custom">
            Selected Colour: {activeColor}
          </div>
        </div>
      ) : null}
    </div>
  );
}
