"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";

interface ColourSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onSelect: (colorName: string) => void;
}

export default function ColourSelector({ colors, selectedColor, onSelect }: ColourSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color.name)}
              className={`group rounded-2xl border p-2 text-left transition-all duration-300 ${
                isSelected
                  ? "border-accent-custom shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_0_35px_rgba(212,175,55,0.14)]"
                  : "border-border-custom/70 hover:border-accent-custom/50"
              }`}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                <Image
                  src={color.imagePath}
                  alt={color.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white/40" style={{ backgroundColor: color.hex }} />
                <span className="text-sm font-medium text-foreground">{color.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={selectedColor}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-accent-custom/30 bg-accent-custom/10 px-4 py-3 text-sm font-medium text-accent-custom"
      >
        Selected Colour: {selectedColor}
      </motion.div>
    </div>
  );
}
