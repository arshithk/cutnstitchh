"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductColor } from "@/data/products";

interface GarmentColorPreviewProps {
  imagePath: string;
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  inquiryOnly?: boolean;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((part) => part + part).join("") : clean;
  const intValue = Number.parseInt(value, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
}

function makeMaskFromImage(img: HTMLImageElement, targetColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.drawImage(img, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const { r, g, b } = hexToRgb(targetColor);

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 180) continue;

    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    const isSkin = red > 180 && green > 140 && blue > 120;
    const isHair = red < 90 && green < 90 && blue < 90;
    const isBackground = red > 220 && green > 220 && blue > 220;
    const isPant = red < 140 && green < 140 && blue > 140;

    if (isSkin || isHair || isBackground || isPant) continue;

    data[i] = Math.round(red * 0.35 + r * 0.65);
    data[i + 1] = Math.round(green * 0.35 + g * 0.65);
    data[i + 2] = Math.round(blue * 0.35 + b * 0.65);
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

export default function GarmentColorPreview({ imagePath, colors, selectedColor, onColorSelect, inquiryOnly = false }: GarmentColorPreviewProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const activeColor = colors.find((color) => color.name === selectedColor) ?? colors[0] ?? null;

  const previewImage = useMemo(() => activeColor?.imagePath || imagePath, [activeColor, imagePath]);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const render = () => {
      const width = image.naturalWidth || image.width || 1200;
      const height = image.naturalHeight || image.height || 1600;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!activeColor) {
        context.drawImage(image, 0, 0, width, height);
        return;
      }

      const targetCanvas = makeMaskFromImage(image, activeColor.hex);
      if (!targetCanvas) {
        context.drawImage(image, 0, 0, width, height);
        return;
      }
      context.drawImage(targetCanvas, 0, 0, width, height);
    };

    if (image.complete) {
      render();
    } else {
      image.onload = render;
    }
  }, [activeColor, previewImage, loaded]);

  return (
    <div className="space-y-6">
      <motion.div
        key={activeColor?.name ?? "default"}
        initial={{ opacity: 0.9, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-4xl border border-white/10 bg-black/80 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-white/10 bg-black/70">
          <Image
            ref={imageRef}
            src={previewImage}
            alt={`${activeColor?.name ?? "product"} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="opacity-0"
            onLoad={() => setLoaded(true)}
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
        </div>
      </motion.div>

      {!inquiryOnly ? (
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
