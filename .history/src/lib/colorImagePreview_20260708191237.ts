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

export function buildColorImageMap(colors: ProductColor[], fallbackImagePath: string) {
  const baseName = buildBaseName(fallbackImagePath);

  return colors.reduce<Record<string, string[]>>((accumulator, color) => {
    const normalizedColor = normalizeColorKey(color.name);
    const explicitPath = color.imagePath?.trim();
    const candidates = explicitPath
      ? [explicitPath]
      : [
          `/images/${baseName}-${normalizedColor}.png`,
          `/images/${baseName}-${normalizedColor}.jpg`,
          `/images/${baseName}-${normalizedColor}.jpeg`,
          `/images/${baseName}-${normalizedColor}.webp`,
          `/images/${baseName}-${normalizedColor}.avif`,
        ];

    accumulator[normalizedColor] = candidates;
    return accumulator;
  }, {});
}

export function getColorImageCandidates(colorImageMap: Record<string, string[]>, colorName: string, fallbackImagePath: string) {
  const colorKey = normalizeColorKey(colorName);
  return colorImageMap[colorKey] ?? [fallbackImagePath];
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
