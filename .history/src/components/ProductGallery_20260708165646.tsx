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

export default function ProductGallery({ colors, selectedColor, onColorSelect, inquiryOnly = false, heroImage }: ProductGalleryProps) {
  const [resolvedImage, setResolvedImage] = useState(heroImage);
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;

  const previewImage = useMemo(() => {
    if (!activeColor) return heroImage;
    return resolvedImage;
  }, [activeColor, heroImage, resolvedImage]);

  useEffect(() => {
    let isCancelled = false;

    if (!activeColor || colors.length === 0) {
      setResolvedImage(heroImage);
      return;
    }

    const candidates = buildColorImageCandidates(heroImage, activeColor.name);
    const checkCandidates = async () => {
      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate, { method: "HEAD" });
          if (!isCancelled && response.ok) {
            setResolvedImage(candidate);
            return;
          }
        } catch {
          // Fall back to the original image when no color-specific asset exists.
        }
      }

      if (!isCancelled) {
        setResolvedImage(heroImage);
      }
    };

    checkCandidates();
    return () => {
      isCancelled = true;
    };
  }, [activeColor?.name, colors.length, heroImage]);

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0, scale: 0.98 }}
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

      {!inquiryOnly ? <ColourSelector colors={colors} selectedColor={selectedColor} onSelect={onColorSelect} /> : null}
    </div>
  );
}
