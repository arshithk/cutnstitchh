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
        initial={{ opacity: 0.95, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-112.5 items-center justify-center py-2 sm:py-3">
          <div className="group relative w-full max-w-112.5 overflow-hidden rounded-3xl border border-[#2b2b2b] bg-[#0f0f0f]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-3">
            <div className="relative aspect-4/5 w-full max-h-125 overflow-hidden rounded-[20px]">
              <motion.div
                key={previewImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={normalizeImageSrc(previewImage)}
                  alt={`${activeColor?.name ?? "product"} preview`}
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

      {!inquiryOnly ? <ColourSelector colors={colors} selectedColor={selectedColor} onSelect={onColorSelect} /> : null}
    </div>
  );
}
