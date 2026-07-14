"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";
import { normalizeImageSrc } from "@/lib/image";

interface ColourSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onSelect: (colorName: string) => void;
}

export default function ColourSelector({ colors, selectedColor, onSelect }: ColourSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 sm:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color.name)}
              className={`group rounded-3xl border-2 p-3 text-left transition-all duration-300 hover:shadow-lg ${
                isSelected
                  ? "border-accent-custom shadow-[0_0_0_2px_rgba(212,175,55,0.3),0_0_45px_rgba(212,175,55,0.2)]"
                  : "border-border-custom/50 hover:border-accent-custom/70 hover:shadow-md"
              }`}
            >
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg">
                <Image
                  src={normalizeImageSrc(color.imagePath || "/images/regular-fit-tshirt-white.jpg")}
                  alt={`${color.name} swatch`}
                  fill
                  sizes="112px"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-5 w-5 rounded-full border-2 border-white/50 transition-transform duration-300 group-hover:scale-125" style={{ backgroundColor: color.hex }} />
                <span className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-accent-custom">{color.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={selectedColor}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-accent-custom/40 bg-gradient-to-r from-accent-custom/15 to-accent-custom/5 px-6 py-4 text-base font-semibold text-accent-custom shadow-sm"
      >
        ✓ Selected Colour: <span className="text-lg">{selectedColor}</span>
      </motion.div>
    </div>
  );
}
