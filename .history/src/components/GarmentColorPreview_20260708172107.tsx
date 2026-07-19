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
        initial={{ opacity: 0.95, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden rounded-[24px] border border-white/10 bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-[450px] items-center justify-center py-2 sm:py-3">
          <div className="group relative w-full max-w-[450px] overflow-hidden rounded-[24px] border border-[#2b2b2b] bg-[#0f0f0f]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-3">
            <div className="relative aspect-[4/5] w-full max-h-[500px] overflow-hidden rounded-[20px]">
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
