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
}

const colours = [
  "Yellow",
  "Dark Yellow",
  "Maroon",
  "Black",
  "Brown",
  "Dark Blue",
  "Navy Blue",
  "Orange",
  "Red",
  "Grey",
  "Purple",
];

const getImagePath = (fileName: string) => `/images/${encodeURI(fileName)}`;

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

  let colourFileName = selectedColour.toLowerCase();

  if (selectedColour === "Dark Blue" && (productSlug === "oversized-t-shirts" || productSlug === "shorts")) {
    colourFileName = "blue";
  }

  return getImagePath(`${prefix} ${colourFileName}.jpg`);
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
}: GarmentColorPreviewProps) {
  const [previewImage, setPreviewImage] = useState(imagePath);
  const [isImageReady, setIsImageReady] = useState(true);

  const productPrefix = useMemo(() => getProductPrefix(productSlug, productName), [productSlug, productName]);
  const activeColor = useMemo(() => {
    return colours.includes(selectedColor) ? selectedColor : colours[0];
  }, [selectedColor]);

  useEffect(() => {
    const nextImage = productSlug ? getProductImage(productSlug, activeColor) : getProductImage(productPrefix, activeColor);
    setPreviewImage(nextImage || imagePath);
    setIsImageReady(true);
  }, [activeColor, imagePath, productPrefix, productSlug]);

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
        className="overflow-hidden rounded-3xl border border-white/10 bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-112.5 items-center justify-center py-2 sm:py-3">
          <div className="group relative w-full max-w-112.5 overflow-hidden rounded-3xl border border-[#2b2b2b] bg-[#0f0f0f]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-3">
            <div className="relative aspect-4/5 w-full max-h-125 overflow-hidden rounded-[20px]">
              <motion.div
                key={previewImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageReady ? 1 : 0.65 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={normalizeImageSrc(previewImage)}
                  alt={`${activeColor} preview`}
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
            {colours.map((colorName) => {
              const isSelected = activeColor === colorName;
              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => onColorSelect(colorName)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${isSelected ? "border-accent-custom bg-accent-custom text-black shadow-[0_0_0_2px_rgba(212,175,55,0.25)]" : "border-white/15 bg-white/5 text-foreground hover:border-accent-custom/60"}`}
                >
                  {colorName}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-accent-custom/30 bg-accent-custom/10 px-4 py-3 text-sm font-medium text-accent-custom">
            Selected Colour: {activeColor}
          </div>
        </div>
      ) : null}
    </div>
  );
}
