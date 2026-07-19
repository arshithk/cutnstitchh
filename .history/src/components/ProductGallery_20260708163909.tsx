"use client";

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

export default function ProductGallery({ colors, selectedColor, onColorSelect, inquiryOnly = false, heroImage }: ProductGalleryProps) {
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;
  const previewImage = activeColor?.imagePath || heroImage;
  const previewTint = activeColor?.hex ?? "#d4af37";

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-black/80 via-black/60 to-[#1a1408] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
        style={{ background: `linear-gradient(140deg, ${previewTint}20 0%, rgba(0,0,0,0.95) 65%)` }}
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={normalizeImageSrc(previewImage)}
            alt={`${activeColor?.name ?? "product"} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 20% 15%, ${previewTint}33 0%, transparent 45%)` }} />
        </div>
      </motion.div>

      {!inquiryOnly ? <ColourSelector colors={colors} selectedColor={selectedColor} onSelect={onColorSelect} /> : null}
    </div>
  );
}
