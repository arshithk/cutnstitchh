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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildColorImageCandidates(baseImagePath: string, colorName: string) {
  const colorSlug = toSlug(colorName);
  const cleanBase = baseImagePath
    .replace(/^\/images\//, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  const extensions = ["jpg", "jpeg", "png", "webp", "avif"];
  return extensions.map((extension) => `/images/${cleanBase}-${colorSlug}.${extension}`);
}

export default function GarmentColorPreview({ imagePath, colors, selectedColor, onColorSelect, inquiryOnly = false }: GarmentColorPreviewProps) {
  const [resolvedImage, setResolvedImage] = useState(imagePath);
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;

  const previewImage = useMemo(() => {
    if (!activeColor) return imagePath;
    return resolvedImage;
  }, [activeColor, imagePath, resolvedImage]);

  useEffect(() => {
    let isCancelled = false;

    if (!activeColor || colors.length === 0) {
      setResolvedImage(imagePath);
      return;
    }

    const candidates = buildColorImageCandidates(imagePath, activeColor.name);
    const checkCandidates = async () => {
      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate, { method: "HEAD" });
          if (!isCancelled && response.ok) {
            setResolvedImage(candidate);
            return;
          }
        } catch {
          // Fall back to the original image if the color-specific asset is unavailable.
        }
      }

      if (!isCancelled) {
        setResolvedImage(imagePath);
      }
    };

    checkCandidates();
    return () => {
      isCancelled = true;
    };
  }, [activeColor?.name, colors.length, imagePath]);

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0.95, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-black/80 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-white/10 bg-black/70">
          <Image
            key={previewImage}
            src={normalizeImageSrc(previewImage)}
            alt={`${activeColor?.name ?? "product"} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
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
