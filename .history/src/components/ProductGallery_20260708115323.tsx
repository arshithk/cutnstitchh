"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";
import ColourSelector from "@/components/ColourSelector";

interface ProductGalleryProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
}

export default function ProductGallery({ colors, selectedColor, onColorSelect }: ProductGalleryProps) {
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0];

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor.name}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-black/80 via-black/60 to-[#1a1408] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
          <Image
            src={activeColor.imagePath}
            alt={`${activeColor.name} ${selectedColor}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
        </div>
      </motion.div>

      <ColourSelector colors={colors} selectedColor={selectedColor} onSelect={onColorSelect} />
    </div>
  );
}
