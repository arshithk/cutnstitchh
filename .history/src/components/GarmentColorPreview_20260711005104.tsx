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
  productSlug?: string;
  productName?: string;
  selectedColorHex?: string;
  fabric?: string;
  gsmRange?: string;
}

export default function GarmentColorPreview({
  imagePath,
  colors,
  selectedColor,
  onColorSelect,
  inquiryOnly = false,
  productSlug = "",
  productName = "",
  selectedColorHex = "#d4af37",
  fabric = "",
  gsmRange = "",
}: GarmentColorPreviewProps) {
  const [previewImage, setPreviewImage] = useState(imagePath);
  const [isImageReady, setIsImageReady] = useState(true);

  const activeColor = useMemo(() => {
    return colors.find((color) => color.name.toLowerCase() === selectedColor.toLowerCase()) ?? colors[0] ?? { name: selectedColor, hex: selectedColorHex, imagePath: imagePath };
  }, [colors, selectedColor, selectedColorHex, imagePath]);

  const resolvedImagePath = useMemo(() => {
    return activeColor.imagePath || imagePath;
  }, [activeColor.imagePath, imagePath]);

  const previewFrameStyle = useMemo(() => ({
    backgroundColor: "#0b0f16",
  }), []);

  useEffect(() => {
    setPreviewImage(resolvedImagePath);
    setIsImageReady(true);
  }, [resolvedImagePath]);

  const handleImageError = () => {
    if (previewImage !== imagePath) {
      setPreviewImage(imagePath);
      setIsImageReady(true);
    }pro
  };

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor.name}
        initial={{ opacity: 0.95, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden rounded-[28px] border border-white/10 bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-122 items-center justify-center px-0 py-0 sm:px-1 sm:py-1">
          <div className="group relative w-full overflow-hidden rounded-[28px] border border-white/10 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-3 lg:p-4" style={previewFrameStyle}>
            <div className="relative mx-auto aspect-4/5 w-full max-w-xl overflow-hidden rounded-3xl bg-white/90">
              <motion.div
                key={previewImage}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: isImageReady ? 1 : 0.65, scale: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={normalizeImageSrc(previewImage)}
                    alt={`${activeColor.name} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    priority
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                    onError={handleImageError}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {!inquiryOnly && colors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = activeColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorSelect(color.name)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${isSelected ? "border-accent-custom bg-accent-custom text-black shadow-[0_0_0_2px_rgba(212,175,55,0.25)]" : "border-white/15 bg-white/5 text-foreground hover:border-accent-custom/60"}`}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-accent-custom/30 bg-accent-custom/10 px-4 py-3 text-sm font-medium text-accent-custom">
            Selected Colour: {activeColor.name}
          </div>
        </div>
      ) : null}
    </div>
  );
}
