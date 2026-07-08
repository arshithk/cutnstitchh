"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";
import ColourSelector from "@/components/ColourSelector";
import { normalizeImageSrc } from "@/lib/image";

interface ProductGalleryProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  inquiryOnly?: boolean;
  heroImage: string;
}

function normalizeColorKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildBaseName(imagePath: string) {
  return imagePath
    .replace(/^\/images\//, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export default function ProductGallery({ colors, selectedColor, onColorSelect, inquiryOnly = false, heroImage }: ProductGalleryProps) {
  const [previewImage, setPreviewImage] = useState(heroImage);
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;

  const colorImageMap = useMemo(() => {
    const baseName = buildBaseName(heroImage);
    return colors.reduce<Record<string, string>>((accumulator, color) => {
      accumulator[normalizeColorKey(color.name)] = `/images/${baseName}-${normalizeColorKey(color.name)}.jpg`;
      return accumulator;
    }, {});
  }, [colors, heroImage]);

  useEffect(() => {
    if (!activeColor) {
      setPreviewImage(heroImage);
      return;
    }

    const mappedImage = colorImageMap[normalizeColorKey(activeColor.name)] ?? heroImage;
    setPreviewImage(mappedImage);
  }, [activeColor?.name, colorImageMap, heroImage]);

  const handleImageError = () => {
    if (previewImage !== heroImage) {
      setPreviewImage(heroImage);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-black/80 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="mx-auto flex w-full max-w-125 items-center justify-center">
          <div className="relative h-80 w-full max-h-87.5 max-w-105 overflow-hidden rounded-3xl border border-white/10 bg-black/70 sm:h-110 sm:max-h-130 sm:max-w-115 md:h-125 md:max-w-125">
            <Image
              key={previewImage}
              src={normalizeImageSrc(previewImage)}
              alt={`${activeColor?.name ?? "product"} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
          </div>
        </div>
      </motion.div>

      {!inquiryOnly ? <ColourSelector colors={colors} selectedColor={selectedColor} onSelect={onColorSelect} /> : null}
    </div>
  );
}
