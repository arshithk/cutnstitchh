import type { ProductColor } from "@/data/products";

export function normalizeColorKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildBaseName(imagePath: string) {
  return imagePath
    .replace(/^\/images\//, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function buildColorSpecificPath(baseName: string, colorName: string) {
  const normalizedBaseName = baseName.trim();
  const normalizedColorName = colorName.trim();

  if (!normalizedColorName || normalizedColorName.toLowerCase() === "white") {
    return [`/images/${normalizedBaseName}.jpg`, `/images/${normalizedBaseName}.jpeg`, `/images/${normalizedBaseName}.png`, `/images/${normalizedBaseName}.webp`, `/images/${normalizedBaseName}.avif`];
  }

  const colorSlug = normalizeColorKey(normalizedColorName);
  const colorPathBase = `${normalizedBaseName}-${colorSlug}`;

  const candidates = [
    `/images/${colorPathBase}.jpg`,
    `/images/${colorPathBase}.jpeg`,
    `/images/${colorPathBase}.png`,
    `/images/${colorPathBase}.webp`,
    `/images/${colorPathBase}.avif`,
  ];

  if (typeof window !== 'undefined') {
    console.log(`[buildColorSpecificPath] colorName="${colorName}", baseName="${normalizedBaseName}", colorSlug="${colorSlug}", candidates:`, candidates);
  }

  return candidates;
}

export function buildColorImageMap(colors: ProductColor[], fallbackImagePath: string) {
  const rawBase = buildBaseName(fallbackImagePath);
  const colorKeys = colors.map((c) => normalizeColorKey(c.name));

  // If the fallback base ends with a color key (e.g. "sweatshirt-grey"), strip
  // that suffix so we build candidates like "sweatshirt maroon" instead of
  // "sweatshirt-grey maroon" which don't exist.
  let baseWithoutColor = rawBase;
  for (const key of colorKeys) {
    if (rawBase.endsWith(`-${key}`)) {
      baseWithoutColor = rawBase.replace(new RegExp(`-${key}$`), "");
      break;
    }
  }

  return colors.reduce<Record<string, string[]>>((accumulator, color) => {
    const normalizedColor = normalizeColorKey(color.name);
    const explicitPath = color.imagePath?.trim();
    const candidates = explicitPath && explicitPath !== fallbackImagePath
      ? [explicitPath]
      : buildColorSpecificPath(baseWithoutColor, color.name);

    accumulator[normalizedColor] = [fallbackImagePath, ...candidates];
    return accumulator;
  }, {});
}

export function getColorImageCandidates(colorImageMap: Record<string, string[]>, colorName: string, fallbackImagePath: string) {
  const colorKey = normalizeColorKey(colorName);
  const candidates = colorImageMap[colorKey] ?? [fallbackImagePath];
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log(`[ColorImagePreview] colorName="${colorName}", colorKey="${colorKey}", candidates:`, candidates);
  }
  return candidates;
}

export async function resolveImageSource(candidates: string[], fallbackImagePath: string) {
  if (typeof window === "undefined") {
    return fallbackImagePath;
  }

  const uniqueCandidates = Array.from(new Set([fallbackImagePath, ...candidates]));

  for (const candidate of uniqueCandidates) {
    try {
      const image = new window.Image();
      await new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = candidate;
      });

      if (image.complete && image.naturalWidth > 0) {
        return candidate;
      }
    } catch {
      // Ignore and continue to the next candidate.
    }
  }

  return fallbackImagePath;
}

export function preloadImageSources(sources: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  sources.forEach((source) => {
    const image = new window.Image();
    image.src = source;
  });
}
