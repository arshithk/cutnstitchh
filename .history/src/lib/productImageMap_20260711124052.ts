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

/**
 * Maps an image base-name to its preferred file extension, derived from the
 * actual filenames present in public/images/.
 *
 * cotton-polo, cotton-tipping-polo, cotton-regular-fit-tshirt → .jpeg
 * oversized-frenchterry, sweatshirt-cotton-fleece, hoodie-without-zip → .png
 * Everything else → .jpg
 */
const PREFERRED_EXTENSION: Record<string, string> = {
  "cotton-polo": ".jpeg",
  "cotton-tipping-polo": ".jpeg",
  "cotton-regular-fit-tshirt": ".jpeg",
  shorts: ".jpeg",
  "lycra-shorts": ".jpeg",
  "lycra-joggers": ".jpeg",
  "oversized-frenchterry": ".png",
  "sweatshirt-cotton-fleece": ".png",
  "hoodie-without-zip": ".png",
};

/**
 * For hoodie-without-zip, three colors (dark-blue, orange, yellow) were
 * uploaded as .jpeg instead of .png.
 */
const HOODIE_WITHOUT_ZIP_JPEG_COLORS = new Set(["dark-blue", "orange", "yellow"]);

export function normalizeColorName(colorName: string) {
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
    const isCotton = matchesFabric(fabric, ["cotton"]) && !matchesFabric(fabric, ["poly"]);
    const isTipping = variantName.includes("tipping") || variantSlug.includes("tipping");
    if (isCotton && isTipping) return "cotton-tipping-polo";
    if (isCotton) return "cotton-polo";
    return "polo-tshirt";
  }

  if (categorySlug.includes("regular-fit")) {
    if (matchesFabric(fabric, ["cotton"]) && !matchesFabric(fabric, ["poly"])) {
      return "cotton-regular-fit-tshirt";
    }
    return "regular-fit-tshirt";
  }

  if (categorySlug.includes("shorts")) {
    return fabric.includes("lycra") ? "lycra-shorts" : "shorts";
  }

  if (categorySlug.includes("joggers")) {
    return fabric.includes("lycra") ? "lycra-joggers" : "joggers";
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
  const imageBaseName = getImageBaseName(context);
  const normalizedColor = normalizeColorName(colorName || "white");

  // hoodie-without-zip: dark-blue, orange, yellow were uploaded as .jpeg; rest are .png
  if (imageBaseName === "hoodie-without-zip") {
    const ext = HOODIE_WITHOUT_ZIP_JPEG_COLORS.has(normalizedColor) ? ".jpeg" : ".png";
    return `/images/${imageBaseName}-${normalizedColor}${ext}`;
  }

  // sweatshirt-cotton-fleece-black was accidentally named with a double dash
  if (imageBaseName === "sweatshirt-cotton-fleece" && normalizedColor === "black") {
    return "/images/sweatshirt-cotton-fleece--black.png";
  }

  // Cotton joggers have mixed uploaded formats.
  if (imageBaseName === "joggers") {
    const ext = new Set(["white", "dark-grey"]).has(normalizedColor) ? ".jpeg" : ".png";
    return `/images/${imageBaseName}-${normalizedColor}${ext}`;
  }

  const ext = PREFERRED_EXTENSION[imageBaseName] ?? ".jpg";
  return `/images/${imageBaseName}-${normalizedColor}${ext}`;
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
