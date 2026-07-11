export interface ProductImageContext {
  categorySlug?: string;
  productSlug?: string;
  productName?: string;
  fabric?: string;
  gsmRange?: string;
  variantName?: string;
  variantSlug?: string;
}

const COLOR_ALIASES: Record<string, string> = {
  blue: "dark-blue",
  "dark blue": "dark-blue",
  "navy": "navy-blue",
  "navy blue": "navy-blue",
  "dark yellow": "dark-yellow",
  "dark yellow (mustard)": "dark-yellow",
  grey: "grey",
  gray: "grey",
  "dark grey": "dark-grey",
  "air force blue": "air-force-blue",
  "bottle green": "bottle-green",
  "royal blue": "royal-blue",
};

function normalizeColorName(colorName: string) {
  const trimmed = colorName.trim().toLowerCase();
  const alias = COLOR_ALIASES[trimmed];
  if (alias) {
    return alias;
  }

  return trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function matchesFabric(fabric: string, terms: string[]) {
  const normalizedFabric = fabric.toLowerCase();
  return terms.some((term) => normalizedFabric.includes(term));
}

function getImageBaseName(context: ProductImageContext) {
  const categorySlug = (context.categorySlug ?? context.productSlug ?? context.productName ?? "").toLowerCase();
  const fabric = (context.fabric ?? "").toLowerCase();
  const gsmRange = (context.gsmRange ?? "").toLowerCase();
  const variantName = (context.variantName ?? "").toLowerCase();
  const variantSlug = (context.variantSlug ?? "").toLowerCase();

  if (categorySlug.includes("hoodie")) {
    return variantName.includes("without zip") || variantSlug.includes("without-zip")
      ? "hoodie-without-zip"
      : "hoodie";
  }

  if (categorySlug.includes("sweatshirt")) {
    return gsmRange.includes("280") || fabric.includes("cotton fleece")
      ? "sweatshirt-cotton-fleece"
      : "sweatshirt";
  }

  if (categorySlug.includes("oversized")) {
    return gsmRange.includes("240") || fabric.includes("french terry") || variantName.includes("french terry")
      ? "oversized-frenchterry"
      : "oversized-tshirt";
  }

  if (categorySlug.includes("polo")) {
    if (matchesFabric(fabric, ["cotton"]) && !matchesFabric(fabric, ["poly"])) {
      return "cotton-polo";
    }
    return "polo-tshirt";
  }

  if (categorySlug.includes("regular-fit")) {
    if (matchesFabric(fabric, ["cotton"]) && !matchesFabric(fabric, ["poly"])) {
      return "cotton-regular-fit-tshirt";
    }
    return "regular-fit-tshirt";
  }

  return "regular-fit-tshirt";
}

export function getProductImageCandidates(
  context: ProductImageContext,
  colorName: string,
  fallbackImagePath = "",
) {
  const baseName = `${getImageBaseName(context)}-${normalizeColorName(colorName || "white")}`;
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  const candidates = extensions.map((extension) => `/images/${baseName}${extension}`);

  if (fallbackImagePath) {
    return Array.from(new Set([fallbackImagePath, ...candidates]));
  }

  return candidates;
}

export function getProductImagePath(context: ProductImageContext, colorName: string, fallbackImagePath = "") {
  return getProductImageCandidates(context, colorName, fallbackImagePath)[0] ?? fallbackImagePath;
}

export async function resolveImagePath(candidates: string[], fallbackImagePath = "") {
  if (typeof window === "undefined") {
    return candidates[0] ?? fallbackImagePath;
  }

  const uniqueCandidates = Array.from(new Set([...(candidates ?? []), fallbackImagePath]));

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
      // Ignore failed candidates and continue.
    }
  }

  return candidates[0] ?? fallbackImagePath;
}
