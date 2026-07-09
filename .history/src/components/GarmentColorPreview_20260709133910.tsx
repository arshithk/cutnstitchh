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
}

const getImagePath = (fileName: string) => `/images/${encodeURI(fileName)}`;

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const fullHex = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const value = Number.parseInt(fullHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const productImagePrefixes: Record<string, string> = {
  "oversized-t-shirts": "oversized-tshirt",
  "regular-fit-t-shirts": "regular-fit-tshirt",
  "polo-t-shirts": "polo-tshirt",
  hoodies: "hoodie",
  sweatshirts: "sweatshirt",
  tracksuits: "tracksuits",
  shorts: "shorts",
  joggers: "joggers",
  "tank-tops": "tank-top",
};

const getProductImage = (productSlug: string, selectedColour: string) => {
  const prefix = productImagePrefixes[productSlug];

  if (!prefix) return "";

  const colour = selectedColour
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `/images/${prefix}-${colour}.jpg`;
};

const getProductPrefix = (productSlug = "", productName = "") => {
  const slug = productSlug.toLowerCase();

  if (productImagePrefixes[slug]) {
    return productImagePrefixes[slug];
  }

  return (productName || slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
};

export default function GarmentColorPreview({
  imagePath,
  colors,
  selectedColor,
  onColorSelect,
  inquiryOnly = false,
  productSlug = "",
  productName = "",
  selectedColorHex = "#d4af37",
}: GarmentColorPreviewProps) {
  const [previewImage, setPreviewImage] = useState(imagePath);
  const [isImageReady, setIsImageReady] = useState(true);

  const productPrefix = useMemo(() => getProductPrefix(productSlug, productName), [productSlug, productName]);
  const activeColor = useMemo(() => {
    return colors.find((color) => color.name.toLowerCase() === selectedColor.toLowerCase()) ?? colors[0];
  }, [colors, selectedColor]);

  const previewFrameStyle = useMemo(() => ({
    backgroundColor: selectedColorHex,
    backgroundImage: `linear-gradient(145deg, ${hexToRgba(selectedColorHex, 0.24)} 0%, ${hexToRgba(selectedColorHex, 0.08)} 55%, rgba(255,255,255,0.04) 100%)`,
  }), [selectedColorHex]);

  useEffect(() => {
    const selectedColorImage = colors.find((color) => color.name === activeColor.name)?.imagePath;
    const nextImage = selectedColorImage || (productSlug ? getProductImage(productSlug, activeColor.name) : getProductImage(productPrefix, activeColor.name));
    setPreviewImage(nextImage || imagePath);
    setIsImageReady(true);
  }, [activeColor.name, colors, imagePath, productPrefix, productSlug]);

  const handleImageError = () => {
    if (previewImage !== imagePath) {
      setPreviewImage(imagePath);
      setIsImageReady(true);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor}
        initial={{ opacity: 0.95, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden rounded-[28px] border border-white/10 bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-122 items-center justify-center px-0 py-0 sm:px-1 sm:py-1">
          <div className="group relative w-full overflow-hidden rounded-[28px] border border-white/10 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-3 lg:p-4" style={previewFrameStyle}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[36rem] overflow-hidden rounded-[24px] bg-white/90">
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
