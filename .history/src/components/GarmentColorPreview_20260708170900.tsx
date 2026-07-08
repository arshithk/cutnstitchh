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

export default function GarmentColorPreview({ imagePath, colors, selectedColor, onColorSelect, inquiryOnly = false }: GarmentColorPreviewProps) {
  const [previewImage, setPreviewImage] = useState(imagePath);
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;

  const colorImageMap = useMemo(() => {
    const baseName = buildBaseName(imagePath);
    return colors.reduce<Record<string, string>>((accumulator, color) => {
      accumulator[normalizeColorKey(color.name)] = `/images/${baseName}-${normalizeColorKey(color.name)}.jpg`;
      return accumulator;
    }, {});
  }, [colors, imagePath]);

  useEffect(() => {
    if (!activeColor) {
      setPreviewImage(imagePath);
      return;
    }

    const mappedImage = colorImageMap[normalizeColorKey(activeColor.name)] ?? imagePath;
    setPreviewImage(mappedImage);
  }, [activeColor?.name, colorImageMap, imagePath]);

  const handleImageError = () => {
    if (previewImage !== imagePath) {
      setPreviewImage(imagePath);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0.95, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-black/80 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="mx-auto flex w-full max-w-[500px] items-center justify-center">
          <div className="relative h-[320px] w-full max-h-[350px] max-w-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/70 sm:h-[440px] sm:max-h-[520px] sm:max-w-[460px] md:h-[500px] md:max-w-[500px]">
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

      {!inquiryOnly && colors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorSelect(color.name)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${isSelected ? "border-accent-custom bg-accent-custom text-black" : "border-white/15 bg-white/5 text-foreground hover:border-accent-custom/60"}`}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-accent-custom/30 bg-accent-custom/10 px-4 py-3 text-sm font-medium text-accent-custom">
            Selected Colour: {selectedColor}
          </div>
        </div>
      ) : null}
    </div>
  );
}
