import { getProductImagePath, type ProductImageContext } from "@/lib/productImageMap";

export interface ProductColor {
  name: string;
  hex: string;
  imagePath: string;
}

export interface ProductPricingTier {
  min: number;
  max?: number;
  price: number;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

const DESCRIPTION_KEYWORDS =
  "Ideal for premium uniforms, branded apparel, corporate merchandising, bulk orders, custom printing, embroidery, and event wear.";

const STANDARD_PRODUCT_PRICING: ProductPricingTier[] = [
  { min: 100, max: 999, price: 175 },
  { min: 1000, max: 5000, price: 173 },
  { min: 5001, price: 170 },
];

function enrichDescription(text: string) {
  return `${text.trim()} ${DESCRIPTION_KEYWORDS}`;
}

function normalizePricing(): ProductPricingTier[] {
  return STANDARD_PRODUCT_PRICING;
}

export interface ProductVariant {
  id: string;
  name: string;
  gsmRange: string;
  fabric: string;
  description: string;
  heroImage: string;
  thumbnailImage?: string;
  colors: ProductColor[];
  sizes: string[];
  moq: string;
  pricing?: ProductPricingTier[];
}

export interface ProductDetail {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  moq: string;
  fabric: string;
  gsmRange: string;
  description: string;
  availableForBulk: boolean;
  premiumQuality: boolean;
  deliveryTimeline: string;
  heroImage: string;
  colors: ProductColor[];
  sizes: string[];
  pricing: ProductPricingTier[];
  features: ProductFeature[];
  relatedSlugs: string[];
  inquiryOnly?: boolean;
  variants?: ProductVariant[];
}

export interface CatalogVariant {
  slug: string;
  name: string;
  gsm: string;
  fabric: string;
  fit: string;
  description: string;
  heroImage: string;
  thumbnailImage?: string;
  colors: ProductColor[];
  sizes: string[];
  moq: string;
  printingCompatibility: string;
  embroideryCompatibility?: string;
  productDescription: string;
  categorySlug: string;
  pricing?: ProductPricingTier[];
  pricingSource?: string;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  variants: CatalogVariant[];
}

const standardAvailableColorPalette: Omit<ProductColor, "imagePath">[] = [
  { name: "White", hex: "#f7f7f2" },
  { name: "Black", hex: "#111111" },
  { name: "Navy Blue", hex: "#20354d" },
  { name: "Royal Blue", hex: "#1f3b64" },
  { name: "Maroon", hex: "#6d2c2c" },
  { name: "Orange", hex: "#c96a17" },
  { name: "Red", hex: "#a52424" },
  { name: "Brown", hex: "#6f4b2f" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Yellow", hex: "#f2c94c" },
  { name: "Dark Yellow (Mustard)", hex: "#b88c12" },
  { name: "Purple", hex: "#6b3fa0" },
];

const shortsAndJoggersColorPalette: Omit<ProductColor, "imagePath">[] = [
  { name: "Bottle Green", hex: "#3f6b3f" },
  { name: "Black", hex: "#111111" },
  { name: "Air Force Blue", hex: "#5d8aa8" },
  { name: "Navy Blue", hex: "#20354d" },
  { name: "Dark Grey", hex: "#4b5563" },
  { name: "Maroon", hex: "#6d2c2c" },
  { name: "Olive", hex: "#6b6e2d" },
];

function getPaletteForContext(context?: ProductImageContext) {
  const category = (context?.categorySlug ?? context?.productSlug ?? "").toLowerCase();
  if (category.includes("shorts") || category.includes("joggers")) {
    return shortsAndJoggersColorPalette;
  }

  return standardAvailableColorPalette;
}

function buildAvailableColors(colors: ProductColor[], fallbackImagePath: string, context?: ProductImageContext): ProductColor[] {
  if (colors.length > 0) {
    return colors.map((color) => ({
      ...color,
      imagePath: color.imagePath || (context ? getProductImagePath(context, color.name, fallbackImagePath) : fallbackImagePath),
    }));
  }

  const palette = getPaletteForContext(context);

  return palette.map((color) => ({
    ...color,
    imagePath: context ? getProductImagePath(context, color.name, fallbackImagePath) : fallbackImagePath,
  }));
}

const baseCatalogCategories: CatalogCategory[] = [
  {
    id: "regular-fit",
    slug: "regular-fit",
    name: "Regular Fit T-Shirt",
    description: "Soft, everyday essentials crafted for premium brands, uniforms, and corporate merchandising.",
    heroImage: "/images/regular-fit-tshirt-red.jpg",
    variants: [
      {
        slug: "cotton-180gsm",
        name: "Cotton 180 GSM Round Neck T-Shirt",
        gsm: "180 GSM",
        fabric: "BIO WASHED Cotton",
        fit: "Regular Fit",
        description: "A breathable cotton staple for premium casualwear and repeat branded apparel orders.",
        heroImage: "/images/regular-fit-tshirt-white.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-red.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular-fit-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Screen printing, embroidery, heat transfer, and direct-to-garment printing.",
        productDescription: "This regular fit cotton tee combines a soft hand feel with a crisp finish, making it ideal for everyday merchandise, staff uniforms, and promotional apparel.",
        pricing: [
          { min: 100, max: 999, price: 175 },
          { min: 1000, max: 4999, price: 173 },
          { min: 5000, price: 170 },
        ],
        categorySlug: "regular-fit",
      },
      
      {
        slug: "polycotton-180gsm",
        name: "PolyCotton 180 GSM Round Neck T-Shirt",
        gsm: "180 GSM",
        fabric: "PolyCotton",
        fit: "Regular Fit",
        description: "A versatile blend tee that offers resilience and comfort for larger production runs.",
        heroImage: "/images/regular-fit-tshirt-grey.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-grey.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Grey", hex: "#6b7280", imagePath: "/images/regular-fit-tshirt-grey.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/regular-fit-tshirt-maroon.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Screen printing, embroidery, and heat transfer are all well suited to this fabric.",
        productDescription: "The polycotton construction balances softness and durability, supporting consistent branding and repeat orders with a polished finish.",
        pricing: [
          { min: 100, max: 999, price: 99 },
          { min: 1000, max: 4999, price: 97 },
          { min: 5000, price: 95 },
        ],
        categorySlug: "regular-fit",
      },
      {
        slug: "polyester-90gsm",
        name: "Polyester 90 GSM Round Neck T-Shirt",
        gsm: "90 GSM",
        fabric: "Polyester",
        fit: "Regular Fit",
        description: "A lightweight option suitable for high-volume custom merchandise and promotional kits.",
        heroImage: "/images/regular-fit-tshirt-red.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-red.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Red", hex: "#a52424", imagePath: "/images/regular-fit-tshirt-red.jpg" },
          { name: "Blue", hex: "#1f3b64", imagePath: "/images/regular-fit-tshirt-dark-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Ideal for screen printing and heat transfer applications with crisp results.",
        productDescription: "This lightweight polyester tee is a practical choice for large-scale events, giveaways, and uniform programs where cost efficiency matters.",
        pricing: [
          { min: 100, max: 999, price: 49 },
          { min: 1000, max: 5000, price: 48 },
          { min: 5001, price: 47 },
        ],
        categorySlug: "regular-fit",
      },
      {
        slug: "polyester-140gsm",
        name: "Polyester 140 GSM Round Neck T-Shirt",
        gsm: "140 GSM",
        fabric: "Polyester",
        fit: "Regular Fit",
        description: "A balanced polyester tee that offers better structure and durability for premium everyday wear.",
        heroImage: "/images/regular-fit-tshirt-navy-blue.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-navy-blue.jpg",
        colors: [
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular-fit-tshirt-navy-blue.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "Orange", hex: "#c96a17", imagePath: "/images/regular-fit-tshirt-orange.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Well suited to sublimation, screen printing, and heat transfer techniques.",
        productDescription: "This mid-weight polyester tee brings dependable structure and a clean finish for custom branding across teamwear and retail merchandise lines.",
        pricing: [
          { min: 100, max: 999, price: 65 },
          { min: 1000, max: 5000, price: 64 },
          { min: 5001, price: 63 },
        ],
        categorySlug: "regular-fit",
      },
      {
        slug: "polyester-110gsm",
        name: "Polyester 110 GSM Round Neck T-Shirt",
        gsm: "110 GSM",
        fabric: "Polyester",
        fit: "Regular Fit",
        description: "A slightly heavier polyester tee designed for comfortable, durable everyday wear.",
        heroImage: "/images/regular-fit-tshirt-navy-blue.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-navy-blue.jpg",
        colors: [
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular-fit-tshirt-navy-blue.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "Orange", hex: "#c96a17", imagePath: "/images/regular-fit-tshirt-orange.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Well suited to sublimation, screen printing, and heat transfer techniques.",
        productDescription: "This fabric offers dependable structure with a clean finish, supporting custom branding across teamwear and retail merchandise lines.",
        pricing: [
          { min: 100, max: 999, price: 60 },
          { min: 1000, max: 5000, price: 59 },
          { min: 5001, price: 58 },
        ],
        categorySlug: "regular-fit",
      },
      {
        slug: "dri-fit-mars-200gsm",
        name: "Dri Fit Mars 200 GSM Round Neck T-Shirt",
        gsm: "200 GSM",
        fabric: "Dri Fit Mars",
        fit: "Regular Fit",
        description: "A performance-led tee with moisture management and an elevated sportswear feel.",
        heroImage: "/images/regular-fit-tshirt-yellow.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-yellow.jpg",
        colors: [
          { name: "Yellow", hex: "#f2c94c", imagePath: "/images/regular-fit-tshirt-yellow.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        printingCompatibility: "Excellent for screen printing and heat transfer on performance fabric bases.",
        productDescription: "The Dri Fit Mars construction is designed for activewear and sports merch that needs comfort, breathability, and a modern finish.",
        categorySlug: "regular-fit",
      },
      {
        slug: "dot-knit-160gsm",
        name: "Dot Knit 160 GSM Round Neck T-Shirt",
        gsm: "160 GSM",
        fabric: "Dot Knit",
        fit: "Regular Fit",
        description: "A soft knit tee with a premium texture suited to fashion and everyday branding pieces.",
        heroImage: "/images/regular-fit-tshirt-purple.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-purple.jpg",
        colors: [
          { name: "Purple", hex: "#6b3fa0", imagePath: "/images/regular-fit-tshirt-purple.jpg" },
          { name: "Grey", hex: "#6b7280", imagePath: "/images/regular-fit-tshirt-grey.jpg" },
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Supports embroidery and screen printing for elevated brand presentation.",
        productDescription: "This premium knit fabric offers subtle texture and a refined drape that lifts any custom merchandise collection.",
        categorySlug: "regular-fit",
      },
    ],
  },
  {
    id: "polo",
    slug: "polo",
    name: "Polo T-Shirt",
    description: "Refined collar styles and premium knits for hospitality, corporate gifting, and retail-ready apparel.",
    heroImage: "/images/polo-tshirt-orange.jpg",
    variants: [
      {
        slug: "cotton-220gsm",
        name: "Cotton 220 GSM Polo Neck T-Shirt",
        gsm: "220 GSM",
        fabric: "Cotton",
        fit: "Polo Fit",
        description: "A polished cotton polo designed for smart casual and premium branding needs.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/polo-tshirt-maroon.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 230 },
          { min: 1001, max: 5000, price: 227 },
          { min: 5001, price: 225 },
        ],
        printingCompatibility: "Embroidery, screen printing, and woven label application work beautifully on this knit.",
        productDescription: "The cotton polo combines a structured collar with a comfortable body, making it ideal for premium uniforms and merchandising collections.",
        categorySlug: "polo",
      },
      {
        slug: "cotton-240gsm",
        name: "Cotton 240 GSM Polo Neck T-Shirt",
        gsm: "240 GSM",
        fabric: "Cotton",
        fit: "Polo Fit",
        description: "A heavyweight polo with a premium hand feel and structured silhouette.",
        heroImage: "/images/polo-tshirt-maroon.jpg",
        thumbnailImage: "/images/polo-tshirt-maroon.jpg",
        colors: [
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/polo-tshirt-maroon.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 290 },
          { min: 1001, max: 5000, price: 287 },
          { min: 5001, price: 285 },
        ],
        printingCompatibility: "Great for embroidery, subtle chest branding, and premium woven labels.",
        productDescription: "The heavier cotton weight offers durability and a refined drape, making it a premium choice for branded apparel lines and staff uniforms.",
        categorySlug: "polo",
      },
      {
        slug: "cotton-240gsm-tipping",
        name: "Cotton 240 GSM Tipping Polo Neck T-Shirt",
        gsm: "240 GSM",
        fabric: "Cotton",
        fit: "Polo Fit",
        description: "A premium tipping polo with a sharp collar and strong presentation quality.",
        heroImage: "/images/polo-tshirt-red.jpg",
        thumbnailImage: "/images/polo-tshirt-red.jpg",
        colors: [
          { name: "Red", hex: "#a52424", imagePath: "/images/polo-tshirt-red.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/polo-tshirt-dark-blue.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 295 },
          { min: 1001, max: 5000, price: 293 },
          { min: 5001, price: 290 },
        ],
        printingCompatibility: "Embroidery and premium chest branding options are ideal for this fabric.",
        productDescription: "Tipping details and a heavier gauge create a polished, professional look suited to fashion-led uniforms and merch drops.",
        categorySlug: "polo",
      },
      {
        slug: "cotton-220gsm-dual-tipping",
        name: "Cotton 220 GSM Dual Tipping Polo Neck T-Shirt",
        gsm: "220 GSM",
        fabric: "Cotton",
        fit: "Polo Fit",
        description: "A refined dual-tipping polo with a distinctive finish and premium presentation.",
        heroImage: "/images/cotton-dual-tipping-polo-white.jpeg",
        thumbnailImage: "/images/cotton-dual-tipping-polo-white.jpeg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/cotton-dual-tipping-polo-white.jpeg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/cotton-dual-tipping-polo-navy-blue.jpeg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/cotton-dual-tipping-polo-maroon.jpeg" },
          { name: "Red", hex: "#a52424", imagePath: "/images/cotton-dual-tipping-polo-red.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 235 },
          { min: 1001, max: 5000, price: 233 },
          { min: 5001, price: 230 },
        ],
        printingCompatibility: "Embroidery, screen printing, and premium branding methods work beautifully on this knit.",
        productDescription: "The dual-tipping detail adds a stylish edge to the classic polo silhouette, making it a standout choice for modern uniforms and branded apparel.",
        categorySlug: "polo",
      },
      {
        slug: "premium-cotton-240gsm",
        name: "Premium Cotton 240 GSM Polo Neck T-Shirt",
        gsm: "240 GSM",
        fabric: "Premium Cotton",
        fit: "Polo Fit",
        description: "A luxury-weight polo created for elevated retail presentation and premium branding.",
        heroImage: "/images/polo-tshirt-brown.jpg",
        thumbnailImage: "/images/polo-tshirt-brown.jpg",
        colors: [
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/polo-tshirt-brown.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 340 },
          { min: 1001, max: 5000, price: 337 },
          { min: 5001, price: 335 },
        ],
        printingCompatibility: "Ideal for embroidery, monograms, and premium chest panel branding.",
        productDescription: "Premium cotton construction and a tailored collar create a refined garment for high-end corporate and retail campaigns.",
        categorySlug: "polo",
      },
      {
        slug: "polycotton-220gsm",
        name: "PolyCotton 220 GSM Polo Neck T-Shirt",
        gsm: "220 GSM",
        fabric: "PolyCotton",
        fit: "Polo Fit",
        description: "A durable polo fabric that combines comfort, structure, and excellent print performance.",
        heroImage: "/images/polo-tshirt-grey.jpg",
        thumbnailImage: "/images/polo-tshirt-grey.jpg",
        colors: [
          { name: "Grey", hex: "#6b7280", imagePath: "/images/polo-tshirt-grey.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 199 },
          { min: 1001, max: 5000, price: 197 },
          { min: 5001, price: 195 },
        ],
        printingCompatibility: "Supports screen printing and heat transfer with reliable clarity and durability.",
        productDescription: "The polycotton construction offers a balanced blend of softness and resilience, making it a practical premium option for repeat orders.",
        categorySlug: "polo",
      },
      {
        slug: "polyester-110gsm",
        name: "Polyester 110 GSM Polo Neck T-Shirt",
        gsm: "110 GSM",
        fabric: "Polyester",
        fit: "Polo Fit",
        description: "A lightweight polo knit for fast-moving promo programs and sportswear launches.",
        heroImage: "/images/polo-tshirt-orange.jpg",
        thumbnailImage: "/images/polo-tshirt-orange.jpg",
        colors: [
          { name: "Orange", hex: "#c96a17", imagePath: "/images/polo-tshirt-orange.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 99 },
          { min: 1001, max: 5000, price: 98 },
          { min: 5001, price: 97 },
        ],
        printingCompatibility: "Excellent for sublimation and heat transfer branding on a lightweight knit.",
        productDescription: "This polyester polo brings responsive performance and easy customization to large-scale merchandise orders.",
        categorySlug: "polo",
      },
      {
        slug: "polyester-140gsm",
        name: "Polyester 140 GSM Polo Neck T-Shirt",
        gsm: "140 GSM",
        fabric: "Polyester",
        fit: "Polo Fit",
        description: "A balanced polyester polo that performs well for branded uniforms and event wear.",
        heroImage: "/images/polo-tshirt-yellow.jpg",
        thumbnailImage: "/images/polo-tshirt-yellow.jpg",
        colors: [
          { name: "Yellow", hex: "#f2c94c", imagePath: "/images/polo-tshirt-yellow.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 99 },
          { min: 1001, max: 5000, price: 98 },
          { min: 5001, price: 97 },
        ],
        printingCompatibility: "Strong compatibility with screen print and heat transfer methods.",
        productDescription: "The heavier polyester weight offers strength and consistency, supporting high-volume programs that need dependable branding results.",
        categorySlug: "polo",
      },
      {
        slug: "dri-fit-mars-200gsm",
        name: "Dri Fit Mars 200 GSM Polo Neck T-Shirt",
        gsm: "200 GSM",
        fabric: "Dri Fit Mars",
        fit: "Polo Fit",
        description: "A performance polo with a polished finish and moisture-wicking comfort.",
        heroImage: "/images/polo-tshirt-purple.jpg",
        thumbnailImage: "/images/polo-tshirt-purple.jpg",
        colors: [
          { name: "Purple", hex: "#6b3fa0", imagePath: "/images/polo-tshirt-purple.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 199 },
          { min: 1001, max: 5000, price: 197 },
          { min: 5001, price: 195 },
        ],
        printingCompatibility: "Works well with screen print, heat transfer, and small logo embroidery.",
        productDescription: "This performance polo is ideal for active merchandising, club apparel, and contemporary promotional collections where function matters.",
        categorySlug: "polo",
      },
      {
        slug: "dot-knit-180gsm",
        name: "Dot Knit 180 GSM Polo Neck T-Shirt",
        gsm: "180 GSM",
        fabric: "Dot Knit",
        fit: "Polo Fit",
        description: "A premium textured polo with standout visual quality and a soft hand feel.",
        heroImage: "/images/polo-tshirt-dark-blue.jpg",
        thumbnailImage: "/images/polo-tshirt-dark-blue.jpg",
        colors: [
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/polo-tshirt-dark-blue.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 149 },
          { min: 1001, max: 5000, price: 147 },
          { min: 5001, price: 145 },
        ],
        printingCompatibility: "Embroidery and premium chest branding are especially suited to this textured knit.",
        productDescription: "The dot knit structure gives the polo a refined, elevated look that works for fashion-focused merchandise and premium events.",
        categorySlug: "polo",
      },
      {
        slug: "saleena-polo-160gsm",
        name: "Saleena Polo 160 GSM Polo Neck T-Shirt",
        gsm: "160 GSM",
        fabric: "Saleena Polo",
        fit: "Polo Fit",
        description: "A lightweight textured polo designed for elevated casualwear and branded uniforms.",
        heroImage: "/images/polo-tshirt-grey.jpg",
        thumbnailImage: "/images/polo-tshirt-grey.jpg",
        colors: [
          { name: "Grey", hex: "#6b7280", imagePath: "/images/polo-tshirt-grey.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/polo-tshirt-brown.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 125 },
          { min: 1001, max: 5000, price: 123 },
          { min: 5001, price: 122 },
        ],
        printingCompatibility: "Great for embroidery and subtle screen print placements.",
        productDescription: "The saleena polo knit gives this polo excellent texture and a premium hand feel for modern corporate and retail merchandise.",
        categorySlug: "polo",
      },
    ],
  },
  {
    id: "oversized",
    slug: "oversized",
    name: "Oversized T-Shirt",
    description: "Statement silhouettes with premium comfort, structure, and elevated casualwear appeal.",
    heroImage: "/images/oversized-tshirt-dark-blue.jpg",
    variants: [
      {
        slug: "cotton-oversized-220gsm",
        name: "Cotton Oversized Round Neck 220 GSM T-Shirt",
        gsm: "220 GSM",
        fabric: "Cotton",
        fit: "Oversized Fit",
        description: "A relaxed oversized tee with strong structure and a modern streetwear finish.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Black", hex: "#0f1115", imagePath: "/images/oversized-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/oversized-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 235 },
          { min: 1000, max: 5000, price: 233 },
          { min: 5000, price: 230 },
        ],
        printingCompatibility: "Screen printing, embroidery, and heat transfer all work beautifully on this oversized staple.",
        embroideryCompatibility: "Embroidery is a strong fit for chest logos and premium branded detailing.",
        productDescription: "This oversized cotton tee delivers a clean silhouette, soft hand feel, and premium drape that elevates fashion and streetwear collections.",
        categorySlug: "oversized",
      },
      {
        slug: "cotton-180gsm-oversized",
        name: "Cotton 180 GSM Oversized Round Neck T-Shirt",
        gsm: "180 GSM",
        fabric: "Cotton",
        fit: "Oversized Fit",
        description: "A lightweight oversized round neck tee for casualwear and premium prints.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Black", hex: "#0f1115", imagePath: "/images/oversized-tshirt-black.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/oversized-tshirt-dark-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 235 },
          { min: 1000, max: 5000, price: 233 },
          { min: 5000, price: 230 },
        ],
        printingCompatibility: "Screen printing, embroidery, and heat transfer all work beautifully on this oversized staple.",
        embroideryCompatibility: "Embroidery is a strong fit for chest logos and premium branded detailing.",
        productDescription: "This oversized cotton tee delivers a clean silhouette, soft hand feel, and premium drape that elevates fashion and streetwear collections.",
        categorySlug: "oversized",
      },
      {
        slug: "french-terry-240gsm",
        name: "Cotton Oversized 240 GSM French Terry T-Shirt",
        gsm: "240 GSM",
        fabric: "French Terry",
        fit: "Oversized Fit",
        description: "A heavyweight French Terry oversized tee with warmth, texture, and elevated comfort.",
        heroImage: "/images/oversized-tshirt-brown.jpg",
        thumbnailImage: "/images/oversized-tshirt-brown.jpg",
        colors: [
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/oversized-tshirt-brown.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/oversized-tshirt-maroon.jpg" },
          { name: "Grey", hex: "#6b7280", imagePath: "/images/oversized-tshirt-grey.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 260 },
          { min: 1000, max: 5000, price: 258 },
          { min: 5000, price: 255 },
        ],
        printingCompatibility: "Ideal for embroidery and premium print placement with a substantial fabric handfeel.",
        embroideryCompatibility: "This heavier French Terry base is well suited to textured embroidery and bold statement branding.",
        productDescription: "The French Terry construction brings warmth and body to an oversized silhouette, making it ideal for elevated casualdrop collections and premium seasonal merch.",
        categorySlug: "oversized",
      },
    ],
  },
  {
    id: "hoodie",
    slug: "hoodie",
    name: "Hoodie",
    description: "Premium hoodies built for warmth, comfort, and elevated branded apparel collections.",
    heroImage: "/images/hoodie-brown.jpg",
    variants: [
      {
        slug: "cotton-fleece-300gsm-hoodie-with-zip",
        name: "Cotton Fleece 300 GSM Hoodie (With Zip)",
        gsm: "300 GSM",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        description: "A premium cotton fleece hoodie with zip detailing for elevated branded outerwear collections.",
        heroImage: "/images/hoodie-white.jpg",
        thumbnailImage: "/images/hoodie-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/hoodie-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/hoodie-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/hoodie-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 499 },
          { min: 1001, max: 5000, price: 497 },
          { min: 5001, price: 496 },
        ],
        printingCompatibility: "Screen printing, embroidery, and heat transfer all work well on this durable fleece base.",
        embroideryCompatibility: "Excellent for chest logos and premium stitched branding.",
        productDescription: "The cotton fleece construction brings warmth, softness, and strong structure to branded hoodie collections and seasonal merch programs.",
        categorySlug: "hoodie",
      },
      {
        slug: "cotton-fleece-300gsm-hoodie-without-zip",
        name: "Cotton Fleece 300 GSM Hoodie (Without Zip)",
        gsm: "300 GSM",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        description: "A premium cotton fleece hoodie without zip for classic everyday branding and casualwear.",
        heroImage: "/images/hoodie-grey.jpg",
        thumbnailImage: "/images/hoodie-grey.jpg",
        colors: [
          { name: "Grey", hex: "#6b7280", imagePath: "/images/hoodie-grey.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/hoodie-maroon.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/hoodie-dark-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 499 },
          { min: 1001, max: 5000, price: 497 },
          { min: 5001, price: 496 },
        ],
        printingCompatibility: "A strong option for screen printing and transfer applications with reliable clarity.",
        embroideryCompatibility: "Supports clean embroidered branding with long-lasting durability.",
        productDescription: "The cotton fleece blend offers premium comfort and a polished appearance for repeat branding orders.",
        categorySlug: "hoodie",
      },
      {
        slug: "cotton-fleece-360gsm-hoodie-with-zip",
        name: "Cotton Fleece 360 GSM Hoodie (With Zip)",
        gsm: "360 GSM",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        description: "A heavyweight cotton fleece hoodie with zip detailing designed for premium outerwear presentation.",
        heroImage: "/images/hoodie-brown.jpg",
        thumbnailImage: "/images/hoodie-brown.jpg",
        colors: [
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/hoodie-brown.jpg" },
          { name: "Orange", hex: "#c96a17", imagePath: "/images/hoodie-orange.jpg" },
          { name: "Purple", hex: "#6b3fa0", imagePath: "/images/hoodie-purple.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Ideal for sublimation, screen printing, and lightweight branded detailing.",
        embroideryCompatibility: "Works beautifully for premium chest and sleeve embroidery.",
        productDescription: "The heavier cotton fleece weight gives this hoodie a luxurious hand feel and strong structure for elevated collections.",
        categorySlug: "hoodie",
      },
      {
        slug: "cotton-fleece-360gsm-hoodie-without-zip",
        name: "Cotton Fleece 360 GSM Hoodie (Without Zip)",
        gsm: "360 GSM",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        description: "A heavyweight cotton fleece hoodie without zip for premium comfort and versatile branding.",
        heroImage: "/images/hoodie-red.jpg",
        thumbnailImage: "/images/hoodie-red.jpg",
        colors: [
          { name: "Red", hex: "#a52424", imagePath: "/images/hoodie-red.jpg" },
          { name: "Yellow", hex: "#f2c94c", imagePath: "/images/hoodie-yellow.jpg" },
          { name: "Dark Yellow", hex: "#c89b17", imagePath: "/images/hoodie-dark- yellow.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Great for screen printing and transfer work with a premium finish.",
        embroideryCompatibility: "Strong for clean embroidered logos and detailing.",
        productDescription: "This heavyweight hoodie provides premium warmth, structure, and a refined look for branded apparel lines.",
        categorySlug: "hoodie",
      },
      {
        slug: "polycotton-fleece-300gsm-hoodie-with-zip",
        name: "PolyCotton Fleece 300 GSM Hoodie (With Zip)",
        gsm: "300 GSM",
        fabric: "PolyCotton Fleece",
        fit: "Regular Fit",
        description: "A resilient polycotton fleece hoodie with zip detailing for functional brand merchandise.",
        heroImage: "/images/hoodie-maroon.jpg",
        thumbnailImage: "/images/hoodie-maroon.jpg",
        colors: [
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/hoodie-maroon.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/hoodie-navy-blue.jpg" },
          { name: "Grey", hex: "#6b7280", imagePath: "/images/hoodie-grey.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 399 },
          { min: 1001, max: 5000, price: 397 },
          { min: 5001, price: 395 },
        ],
        printingCompatibility: "Works well with screen printing and transfer applications.",
        embroideryCompatibility: "Supports durable stitched branding and logos.",
        productDescription: "The polycotton blend offers excellent durability and shape retention while keeping the hoodie comfortable and polished.",
        categorySlug: "hoodie",
      },
      {
        slug: "polycotton-fleece-300gsm-hoodie-without-zip",
        name: "PolyCotton Fleece 300 GSM Hoodie (Without Zip)",
        gsm: "300 GSM",
        fabric: "PolyCotton Fleece",
        fit: "Regular Fit",
        description: "A durable polycotton fleece hoodie without zip for practical, premium custom apparel.",
        heroImage: "/images/hoodie-dark-blue.jpg",
        thumbnailImage: "/images/hoodie-dark-blue.jpg",
        colors: [
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/hoodie-dark-blue.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/hoodie-black.jpg" },
          { name: "White", hex: "#f5f5f2", imagePath: "/images/hoodie-white.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 1000, price: 349 },
          { min: 1001, max: 5000, price: 347 },
          { min: 5001, price: 345 },
        ],
        printingCompatibility: "A strong option for screen printing and direct branding applications.",
        embroideryCompatibility: "Supports clean embroidered branding with long-lasting durability.",
        productDescription: "This polycotton hoodie offers shape retention, durability, and all-season comfort for repeat orders.",
        categorySlug: "hoodie",
      },
    ],
  },
  {
    id: "sweatshirt",
    slug: "sweatshirt",
    name: "Sweatshirt",
    description: "Soft, structured sweatshirts crafted for teamwear, lifestyle merch, and premium custom branding.",
    heroImage: "/images/sweatshirt-purple.jpg",
    variants: [
      {
        slug: "cotton-french-terry-240gsm-sweatshirt",
        name: "Cotton French Terry 240 GSM Sweatshirt",
        gsm: "240 GSM",
        fabric: "Cotton French Terry",
        fit: "Regular Fit",
        description: "A soft cotton French Terry sweatshirt with premium comfort and everyday versatility.",
        heroImage: "/images/sweatshirt-white.jpg",
        thumbnailImage: "/images/sweatshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/sweatshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/sweatshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/sweatshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Screen printing and embroidery are ideal for bold brand placement.",
        embroideryCompatibility: "Perfect for chest logos and sleeve detailing.",
        productDescription: "This regular-fit sweatshirt offers warmth, resilience, and a polished finish for premium merch programs.",
        categorySlug: "sweatshirt",
      },
      {
        slug: "cotton-fleece-280gsm-sweatshirt",
        name: "Cotton Fleece 300 GSM Sweatshirt",
        gsm: "300 GSM",
        fabric: "Cotton Fleece",
        fit: "Regular Fit",
        description: "A premium cotton fleece sweatshirt with a comfortable hand feel and strong structure.",
        heroImage: "/images/sweatshirt-cotton-fleece-white.png",
        thumbnailImage: "/images/sweatshirt-cotton-fleece-white.png",
        colors: [
          { name: "Grey", hex: "#6b7280", imagePath: "/images/sweatshirt-cotton-fleece-grey.png" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/sweatshirt-cotton-fleece-maroon.jpeg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/sweatshirt-cotton-fleece-dark-blue.png" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Supports screen printing and heat transfer with reliable clarity.",
        embroideryCompatibility: "Strong for chest and sleeve embroidered branding.",
        productDescription: "The cotton fleece construction provides lasting shape retention and dependable comfort for repeat orders.",
        categorySlug: "sweatshirt",
      },
      {
        slug: "polycotton-french-terry-240gsm-sweatshirt",
        name: "PolyCotton French Terry 240 GSM Sweatshirt",
        gsm: "240 GSM",
        fabric: "PolyCotton French Terry",
        fit: "Regular Fit",
        description: "A durable polycotton French Terry sweatshirt designed for everyday comfort and repeat merch programs.",
        heroImage: "/images/sweatshirt-white.jpg",
        thumbnailImage: "/images/sweatshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/sweatshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/sweatshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/sweatshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Great for screen printing and embroidery on a durable everyday base.",
        embroideryCompatibility: "Supports clean logo placement and premium finishing details.",
        productDescription: "The polycotton French Terry blend balances softness, durability, and structure for high-volume apparel programs.",
        categorySlug: "sweatshirt",
      },
      {
        slug: "polycotton-fleece-300gsm-sweatshirt",
        name: "PolyCotton Fleece 300 GSM Sweatshirt",
        gsm: "300 GSM",
        fabric: "PolyCotton Fleece",
        fit: "Regular Fit",
        description: "A resilient fleece sweatshirt offering warmth, durability, and polished presentation for custom branding.",
        heroImage: "/images/sweatshirt-cotton-fleece-white.png",
        thumbnailImage: "/images/sweatshirt-cotton-fleece-white.png",
        colors: [
          { name: "Grey", hex: "#6b7280", imagePath: "/images/sweatshirt-cotton-fleece-grey.png" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/sweatshirt-cotton-fleece-maroon.jpeg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/sweatshirt-cotton-fleece-dark-blue.png" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Well suited to screen printing and transfer work on a structured fleece base.",
        embroideryCompatibility: "Strong for bold embroidered branding and sleeve detailing.",
        productDescription: "The polycotton fleece construction delivers premium warmth and repeat-wear durability for premium staff and merch collections.",
        categorySlug: "sweatshirt",
      },
    ],
  },
  {
    id: "shorts",
    slug: "shorts",
    name: "Shorts",
    description: "Performance-led shorts crafted for comfort, movement, and premium custom branding.",
    heroImage: "/images/shorts-navy-blue.jpeg",
    variants: [
      {
        slug: "cotton-french-terry-240gsm-shorts",
        name: "Cotton French Terry 240 GSM Shorts",
        gsm: "240 GSM",
        fabric: "Cotton French Terry",
        fit: "Relaxed Fit",
        description: "A soft cotton French Terry short with premium comfort and everyday versatility.",
        heroImage: "/images/shorts-white.jpeg",
        thumbnailImage: "/images/shorts-white.jpeg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/shorts-white.jpeg" },
          { name: "Black", hex: "#111111", imagePath: "/images/shorts-black.jpeg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/shorts-navy-blue.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Screen printing and heat transfer are ideal for bold branding on this fabric base.",
        embroideryCompatibility: "Good for clean embroidery on the waistband or side panels.",
        productDescription: "The cotton French Terry construction gives these shorts a soft feel, strong structure, and modern casual appeal.",
        categorySlug: "shorts",
      },
      {
        slug: "polycotton-french-terry-240gsm-shorts",
        name: "PolyCotton French Terry 240 GSM Shorts",
        gsm: "240 GSM",
        fabric: "PolyCotton French Terry",
        fit: "Relaxed Fit",
        description: "A durable polycotton short with comfort and easy care for repeat merchandising programs.",
        heroImage: "/images/shorts-dark-grey.jpeg",
        thumbnailImage: "/images/shorts-dark-grey.jpeg",
        colors: [
          { name: "Dark Grey", hex: "#4b5563", imagePath: "/images/shorts-dark-grey.jpeg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/shorts-maroon.jpeg" },
          { name: "Olive", hex: "#6b6e2d", imagePath: "/images/shorts-olive.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Well suited to screen printing and transfer work for larger orders.",
        embroideryCompatibility: "Supports clean embroidered branding with reliable durability.",
        productDescription: "The polycotton blend adds durability and shape retention while keeping the shorts comfortable and stylish.",
        categorySlug: "shorts",
      },
      {
        slug: "two-way-lycra-polyester-190gsm-shorts",
        name: "2-Way Lycra Polyester 190 GSM Shorts",
        gsm: "190 GSM",
        fabric: "2-Way Lycra Polyester",
        fit: "Athletic Fit",
        description: "A high-mobility short with stretch and performance-driven comfort for activewear branding.",
        heroImage: "/images/lycra-shorts-navy-blue.jpeg",
        thumbnailImage: "/images/lycra-shorts-navy-blue.jpeg",
        colors: [
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/lycra-shorts-navy-blue.jpeg" },
          { name: "Black", hex: "#111111", imagePath: "/images/lycra-shorts-black.jpeg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/lycra-shorts-maroon.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Excellent for sublimation and high-definition graphic placement.",
        embroideryCompatibility: "Suitable for lightweight embroidered detailing and logos.",
        productDescription: "The stretch polyester construction makes these shorts ideal for sportswear, active merch, and performance-driven branding campaigns.",
        categorySlug: "shorts",
      },
      {
        slug: "four-way-lycra-polyester-220gsm-shorts",
        name: "4-Way Lycra Polyester 220 GSM Shorts",
        gsm: "220 GSM",
        fabric: "4-Way Lycra Polyester",
        fit: "Athletic Fit",
        description: "A premium stretch short designed for movement, shape retention, and modern performance wear.",
        heroImage: "/images/lycra-shorts-bottle-green.jpeg",
        thumbnailImage: "/images/lycra-shorts-bottle-green.jpeg",
        colors: [
          { name: "Bottle Green", hex: "#3f6b3f", imagePath: "/images/lycra-shorts-bottle-green.jpeg" },
          { name: "Air Force Blue", hex: "#5d8aa8", imagePath: "/images/lycra-shorts-air-force-blue.jpeg" },
          { name: "Olive", hex: "#6b6e2d", imagePath: "/images/lycra-shorts-olive.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Perfect for sublimation and bold graphics on performance fabrics.",
        embroideryCompatibility: "Supports premium logo detailing with stretch-friendly structure.",
        productDescription: "This 4-way stretch short offers flexibility and a premium finish that elevates sports and lifestyle merchandise programs.",
        categorySlug: "shorts",
      },
    ],
  },
  {
    id: "joggers",
    slug: "joggers",
    name: "Joggers",
    description: "Premium joggers with polished comfort, sporty structure, and strong merchandising appeal.",
    heroImage: "/images/joggers-olive.png",
    variants: [
      {
        slug: "cotton-french-terry-240gsm-joggers",
        name: "Cotton French Terry 240 GSM Joggers",
        gsm: "240 GSM",
        fabric: "Cotton French Terry",
        fit: "Relaxed Fit",
        description: "A soft cotton jogger with premium comfort and an easygoing everyday silhouette.",
        heroImage: "/images/joggers-white.jpeg",
        thumbnailImage: "/images/joggers-white.jpeg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/joggers-white.jpeg" },
          { name: "Black", hex: "#111111", imagePath: "/images/joggers-black.png" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/joggers-navy-blue.png" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Screen printing and transfer methods work well on this soft French Terry base.",
        embroideryCompatibility: "Great for logo embroidery on the leg or pocket area.",
        productDescription: "These cotton joggers give a premium look and feel for branded casualwear, events, and loungewear merch.",
        categorySlug: "joggers",
      },
      {
        slug: "polycotton-french-terry-240gsm-joggers",
        name: "PolyCotton French Terry 240 GSM Joggers",
        gsm: "240 GSM",
        fabric: "PolyCotton French Terry",
        fit: "Relaxed Fit",
        description: "A durable polycotton jogger tailored for premium comfort and repeat wear.",
        heroImage: "/images/joggers-dark-grey.jpeg",
        thumbnailImage: "/images/joggers-dark-grey.jpeg",
        colors: [
          { name: "Dark Grey", hex: "#4b5563", imagePath: "/images/joggers-dark-grey.jpeg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/joggers-maroon.png" },
          { name: "Olive", hex: "#6b6e2d", imagePath: "/images/joggers-olive.png" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Reliable for screen printing and transfer branding on a sturdy base.",
        embroideryCompatibility: "Supports crisp embroidery with a polished presentation.",
        productDescription: "The polycotton blend balances softness and durability, making these joggers a practical choice for larger orders.",
        categorySlug: "joggers",
      },
      {
        slug: "two-way-lycra-polyester-190gsm-joggers",
        name: "2-Way Lycra Polyester 190 GSM Joggers",
        gsm: "190 GSM",
        fabric: "2-Way Lycra Polyester",
        fit: "Athletic Fit",
        description: "A flexible performance jogger with stretch and a sporty, streamlined silhouette.",
        heroImage: "/images/lycra-joggers-navy-blue.jpeg",
        thumbnailImage: "/images/lycra-joggers-navy-blue.jpeg",
        colors: [
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/lycra-joggers-navy-blue.jpeg" },
          { name: "Black", hex: "#111111", imagePath: "/images/lycra-joggers-black.jpeg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/lycra-joggers-maroon.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Excellent for sublimation and performance-oriented graphic branding.",
        embroideryCompatibility: "Suitable for lightweight embroidered details and branding.",
        productDescription: "These performance joggers are ideal for sportswear and active merch that need flexibility, comfort, and a modern finish.",
        categorySlug: "joggers",
      },
      {
        slug: "four-way-lycra-polyester-220gsm-joggers",
        name: "4-Way Lycra Polyester 220 GSM Joggers",
        gsm: "220 GSM",
        fabric: "4-Way Lycra Polyester",
        fit: "Athletic Fit",
        description: "A premium stretch jogger with structure, comfort, and a polished performance finish.",
        heroImage: "/images/lycra-joggers-bottle-green.jpeg",
        thumbnailImage: "/images/lycra-joggers-bottle-green.jpeg",
        colors: [
          { name: "Bottle Green", hex: "#3f6b3f", imagePath: "/images/lycra-joggers-bottle-green.jpeg" },
          { name: "Air Force Blue", hex: "#5d8aa8", imagePath: "/images/lycra-joggers-air-force-blue.jpeg" },
          { name: "Olive", hex: "#6b6e2d", imagePath: "/images/lycra-joggers-olive.jpeg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        printingCompatibility: "Perfect for sublimation and bold graphics on performance fabrics.",
        embroideryCompatibility: "Supports premium logo detailing with stretch-friendly structure.",
        productDescription: "The 4-way stretch composition delivers a stronger shape and a premium finish for modern activewear merchandising.",
        categorySlug: "joggers",
      },
    ],
  },
];

export const catalogCategories: CatalogCategory[] = baseCatalogCategories.map((category) => ({
  ...category,
  description: enrichDescription(category.description),
  variants: category.variants.map((variant) => ({
    ...variant,
    productDescription: enrichDescription(variant.productDescription),
    colors: buildAvailableColors([], variant.heroImage, {
      categorySlug: category.slug,
      productSlug: category.slug,
      productName: category.name,
      fabric: variant.fabric,
      gsmRange: variant.gsm,
      variantName: variant.name,
      variantSlug: variant.slug,
    }),
  })),
}));

export function getCatalogCategoryBySlug(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getCatalogCategorySlugByLegacyProductSlug(slug: string) {
  const mapping: Record<string, string> = {
    "regular-fit-t-shirts": "regular-fit",
    "polo-t-shirts": "polo",
    "oversized-t-shirts": "oversized",
  };

  return mapping[slug];
}

export function getCatalogVariantBySlug(categorySlug: string, variantSlug: string) {
  const category = getCatalogCategoryBySlug(categorySlug);
  const variant = category?.variants.find((variant) => variant.slug === variantSlug);
  if (!variant) return variant;

  // Resolve pricing for catalog variants using authoritative product data
  // 1) prefer a matching product variant's pricing
  // 2) fall back to the product's pricing
  // 3) fall back to user-provided overrides (mapping below)
  try {
    const product = getProductByCategorySlug(categorySlug);
    let pricing: ProductPricingTier[] | undefined;
    let pricingSource: string | undefined;

    if (variant.pricing?.length) {
      pricing = variant.pricing;
    } else if (product?.variants) {
      const matched = product.variants.find((pv) => {
        const pvName = (pv.name ?? "").toLowerCase();
        const vName = (variant.name ?? "").toLowerCase();
        const pvGsm = (pv.gsmRange ?? "").toLowerCase();
        const vGsm = (variant.gsm ?? "").toLowerCase();

        if (pvName && vName && pvName.includes(vName.split(" ")[0])) return true;
        if (pvGsm && vGsm && pvGsm.includes(vGsm)) return true;
        if (pv.fabric && variant.fabric && pv.fabric.toLowerCase() === variant.fabric.toLowerCase()) return true;

        return false;
      });

      pricing = matched?.pricing;
    }

    if (!pricing && product) {
      pricing = product.pricing;
      pricingSource = "product pricing";
    }

    if (!pricing) {
      pricing = matchUserPricingForVariant(variant);
      pricingSource = "user override pricing";
    }

    return { ...variant, pricing, pricingSource };
  } catch {
    return variant;
  }
}

function matchUserPricingForVariant(variant: CatalogVariant): ProductPricingTier[] | undefined {
  const name = (variant.name ?? "").toLowerCase();
  const fabric = (variant.fabric ?? "").toLowerCase();
  const gsm = (variant.gsm ?? "").toLowerCase();

  // Helper to build tiers
  const t = (a: number, b: number | undefined, p: number) => (b ? { min: a, max: b, price: p } : { min: a, price: p });

  // Round Neck T-Shirts
  if (fabric.includes("premium") && gsm.includes("180")) {
    return [t(100, 999, 175), t(1000, 5000, 173), t(5001, undefined, 170)];
  }
  if (fabric.includes("polycotton") && gsm.includes("180")) {
    return [t(100, 999, 99), t(1000, 5000, 97), t(5001, undefined, 95)];
  }
  if (fabric.includes("polyester") && gsm.includes("90")) {
    return [t(100, 999, 49), t(1000, 5000, 48), t(5001, undefined, 47)];
  }
  if (fabric.includes("polyester") && gsm.includes("110")) {
    return [t(100, 999, 60), t(1000, 5000, 59), t(5001, undefined, 58)];
  }
  if (fabric.includes("polyester") && gsm.includes("140")) {
    return [t(100, 999, 65), t(1000, 5000, 64), t(5001, undefined, 63)];
  }

  // Polo T-Shirts
  if (name.includes("dri fit") && gsm.includes("180")) {
    return [t(100, 1000, 149), t(1001, 5000, 147), t(5001, undefined, 145)];
  }
  if (name.includes("honeycomb") || name.includes("honey")) {
    return [t(100, 1000, 115), t(1001, 5000, 114), t(5001, undefined, 113)];
  }
  if (name.includes("selena") || name.includes("saleena") || name.includes("selena")) {
    return [t(100, 1000, 125), t(1001, 5000, 123), t(5001, undefined, 122)];
  }
  if (fabric.includes("polycotton") && name.includes("polo")) {
    return [t(100, 1000, 199), t(1001, 5000, 197), t(5001, undefined, 195)];
  }
  if (fabric.includes("polyester") && name.includes("polo")) {
    return [t(100, 1000, 99), t(1001, 5000, 98), t(5001, undefined, 97)];
  }
  if (name.includes("dri fit mars") || name.includes("mars")) {
    return [t(100, 1000, 199), t(1001, 5000, 197), t(5001, undefined, 195)];
  }
  if (name.includes("cotton") && gsm.includes("220") && name.includes("dual")) {
    return [t(100, 1000, 235), t(1001, 5000, 233), t(5001, undefined, 230)];
  }
  if (name.includes("cotton") && gsm.includes("220") && name.includes("tipping") ) {
    return [t(100, 1000, 235), t(1001, 5000, 233), t(5001, undefined, 230)];
  }
  if (name.includes("cotton") && gsm.includes("220") && !name.includes("tipping") && !name.includes("dual")) {
    return [t(100, 1000, 230), t(1001, 5000, 227), t(5001, undefined, 225)];
  }
  if (name.includes("cotton") && gsm.includes("240") && name.includes("tipping")) {
    return [t(100, 1000, 295), t(1001, 5000, 293), t(5001, undefined, 290)];
  }
  if (name.includes("cotton") && gsm.includes("240") && name.includes("dual")) {
    return [t(100, 1000, 235), t(1001, 5000, 233), t(5001, undefined, 230)];
  }
  if (name.includes("premium cotton") && gsm.includes("240")) {
    return [t(100, 1000, 340), t(1001, 5000, 337), t(5001, undefined, 335)];
  }

  // Hoodies
  if (fabric.includes("polycotton") && name.includes("hoodie") && gsm.includes("300") && name.includes("without")) {
    return [t(100, 1000, 349), t(1001, 5000, 347), t(5001, undefined, 345)];
  }
  if (fabric.includes("polycotton") && name.includes("hoodie") && gsm.includes("300") && name.includes("with")) {
    return [t(100, 1000, 399), t(1001, 5000, 397), t(5001, undefined, 395)];
  }
  if (fabric.includes("cotton") && name.includes("hoodie") && gsm.includes("300") && name.includes("without")) {
    return [t(100, 1000, 499), t(1001, 5000, 497), t(5001, undefined, 496)];
  }
  if (fabric.includes("cotton") && name.includes("hoodie") && gsm.includes("300") && name.includes("with")) {
    return [t(100, 1000, 549), t(1001, 5000, 547), t(5001, undefined, 545)];
  }
  if (fabric.includes("polycotton") && name.includes("hoodie") && gsm.includes("340") && name.includes("without")) {
    return [t(100, 1000, 399), t(1001, 5000, 397), t(5001, undefined, 395)];
  }
  if (fabric.includes("polycotton") && name.includes("hoodie") && gsm.includes("340") && name.includes("with")) {
    return [t(100, 1000, 435), t(1001, 5000, 433), t(5001, undefined, 430)];
  }
  if (fabric.includes("cotton") && name.includes("hoodie") && gsm.includes("360") && name.includes("without")) {
    return [t(100, 1000, 690), t(1001, 5000, 688), t(5001, undefined, 685)];
  }
  if (fabric.includes("cotton") && name.includes("hoodie") && gsm.includes("360") && name.includes("with")) {
    return [t(100, 1000, 750), t(1001, 5000, 748), t(5001, undefined, 745)];
  }

  // Oversized
  if (name.includes("oversized") && gsm.includes("180")) {
    return [t(100, 999, 235), t(1000, 5000, 233), t(5001, undefined, 230)];
  }
  if (name.includes("oversized") && gsm.includes("220")) {
    return [t(100, 999, 235), t(1000, 5000, 233), t(5001, undefined, 230)];
  }
  if (name.includes("french terry") && name.includes("oversized")) {
    return [t(100, 999, 260), t(1000, 5000, 258), t(5001, undefined, 255)];
  }

  return undefined;
}

/**
 * Maps catalog category slugs to their corresponding product detail slug.
 * Catalog slugs (e.g. "regular-fit") differ from product slugs (e.g. "regular-fit-t-shirts").
 */
const CATALOG_TO_PRODUCT_SLUG: Record<string, string> = {
  "regular-fit": "regular-fit-t-shirts",
  "polo": "polo-t-shirts",
  "oversized": "oversized-t-shirts",
  "shorts": "shorts",
  "joggers": "joggers",
};

export function getProductByCategorySlug(categorySlug: string) {
  const productSlug = CATALOG_TO_PRODUCT_SLUG[categorySlug] ?? categorySlug;
  return productsBySlug.get(productSlug) ?? null;
}

/**
 * Returns the pricing tiers for the product that corresponds to a catalog category slug.
 */
export function getProductPricingByCategorySlug(categorySlug: string): ProductPricingTier[] {
  const productSlug = CATALOG_TO_PRODUCT_SLUG[categorySlug] ?? categorySlug;
  const pricing = productsBySlug.get(productSlug)?.pricing ?? [];
  if (pricing.length > 0) return pricing;

  return STANDARD_PRODUCT_PRICING;
}

const baseProducts: ProductDetail[] = [
  {
    slug: "oversized-t-shirts",
    name: "Oversized T-Shirts",
    category: "T-Shirts",
    tagline: "Statement silhouettes with premium comfort",
    moq: "100 Pieces",
    fabric: "BIO WASHED 100% Cotton",
    gsmRange: "220-280 GSM",
    description:
      "Crafted for modern streetwear and premium retail capsules, these oversized tees balance softness, durability, and effortless structure.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "7-10 working days",
    heroImage: "/images/oversized-tshirt-orange.jpg",
    colors: [
      { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Black", hex: "#0f1115", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Navy Blue", hex: "#20354d", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Blue", hex: "#1f3b64", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Orange", hex: "#c96a17", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Red", hex: "#a52424", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Brown", hex: "#6f4b2f", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Yellow", hex: "#f2c94c", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Dark Yellow", hex: "#b88c12", imagePath: "/images/oversized tshirt.jpg" },
      { name: "Purple", hex: "#6b3fa0", imagePath: "/images/oversized tshirt.jpg" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    pricing: [
      { min: 100, max: 999, price: 105 },
      { min: 1000, max: 4999, price: 103 },
      { min: 5000, price: 100 },
    ],
    variants: [
      {
        id: "oversized-180-cotton",
        name: "180 GSM Cotton",
        gsmRange: "180 GSM",
        fabric: "100% Cotton",
        description: "A lightweight oversized tee for premium everyday wear and flexible bulk production.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Black", hex: "#0f1115", imagePath: "/images/oversized-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/oversized-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 102 },
          { min: 1000, max: 4999, price: 99 },
          { min: 5000, price: 96 },
        ],
      },
      {
        id: "cotton-180gsm-oversized",
        name: "180 GSM Cotton (Oversized)",
        gsmRange: "180 GSM",
        fabric: "100% Cotton",
        description: "A lightweight oversized round neck tee for casualwear and premium prints.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Black", hex: "#0f1115", imagePath: "/images/oversized-tshirt-black.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/oversized-tshirt-dark-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 102 },
          { min: 1000, max: 4999, price: 99 },
          { min: 5000, price: 96 },
        ],
      },
      {
        id: "oversized-220-cotton",
        name: "220 GSM Cotton",
        gsmRange: "220 GSM",
        fabric: "100% Cotton",
        description: "A structured oversized fit designed for premium retail and modern streetwear capsules.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Black", hex: "#0f1115", imagePath: "/images/oversized-tshirt-black.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/oversized-tshirt-maroon.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 105 },
          { min: 1000, max: 4999, price: 103 },
          { min: 5000, price: 100 },
        ],
      },
      {
        id: "oversized-240-premium-cotton",
        name: "240 GSM Premium Cotton",
        gsmRange: "240 GSM",
        fabric: "Premium Cotton",
        description: "A heavyweight oversized option with enhanced drape, durability, and elevated finish quality.",
        heroImage: "/images/oversized-tshirt-white.jpg",
        thumbnailImage: "/images/oversized-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/oversized-tshirt-navy-blue.jpg" },
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/oversized-tshirt-brown.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 112 },
          { min: 1000, max: 4999, price: 109 },
          { min: 5000, price: 106 },
        ],
      },
    ],
    features: [
      { title: "100% Cotton", description: "Soft, breathable and ideal for premium wear", icon: "Sprout" },
      { title: "Export Quality", description: "Finished to international apparel standards", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Reliable scale with consistent finishing", icon: "Factory" },
      { title: "Fast Dispatch", description: "Quick turnaround for urgent bulk orders", icon: "Truck" },
      { title: "Custom Branding", description: "Screen-printing, embroidery and labels available", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Efficient dispatch from our production hub", icon: "MapPinned" },
    ],
    relatedSlugs: ["regular-fit-t-shirts", "polo-t-shirts", "shorts", "joggers"],
  },
  {
    slug: "regular-fit-t-shirts",
    name: "Regular Fit T-Shirts",
    category: "T-Shirts",
    tagline: "Everyday essentials with a refined finish",
    moq: "100 Pieces",
    fabric: "BIO WASHED 100% Cotton",
    gsmRange: "180-200 GSM",
    description:
      "A polished base layer for uniforms, promotional apparel, and daily wear, with crisp construction and soft hand feel.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "6-8 working days",
    heroImage: "/images/regular-fit-tshirt-red.jpg",
    colors: [
      { name: "White", hex: "#f7f7f2", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Black", hex: "#111111", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Orange", hex: "#c96a17", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Red", hex: "#a52424", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Brown", hex: "#6f4b2f", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Yellow", hex: "#f2c94c", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Dark Yellow", hex: "#b88c12", imagePath: "/images/regular fit tshirt.jpg" },
      { name: "Purple", hex: "#6b3fa0", imagePath: "/images/regular fit tshirt.jpg" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 98 },
      { min: 1000, max: 4999, price: 95 },
      { min: 5000, price: 92 },
    ],
    variants: [
      {
        id: "regular-180-cotton",
        name: "180 GSM Cotton",
        gsmRange: "180 GSM",
        fabric: "100% Cotton",
        description: "A soft everyday regular fit tee made for premium casualwear and repeat corporate orders.",
        heroImage: "/images/regular-fit-tshirt-white.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular-fit-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 92 },
          { min: 1000, max: 4999, price: 89 },
          { min: 5000, price: 86 },
        ],
      },
      {
        id: "regular-220-cotton",
        name: "220 GSM Cotton",
        gsmRange: "220 GSM",
        fabric: "100% Cotton",
        description: "A more substantial regular fit tee with premium structure and a clean retail finish.",
        heroImage: "/images/regular-fit-tshirt-white.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/regular-fit-tshirt-black.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/regular-fit-tshirt-maroon.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 98 },
          { min: 1000, max: 4999, price: 95 },
          { min: 5000, price: 92 },
        ],
      },
      {
        id: "regular-240-premium-cotton",
        name: "240 GSM Premium Cotton",
        gsmRange: "240 GSM",
        fabric: "Premium Cotton",
        description: "A premium heavyweight regular fit tee tailored for elevated merchandising and fashion collections.",
        heroImage: "/images/regular-fit-tshirt-white.jpg",
        thumbnailImage: "/images/regular-fit-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f7f7f2", imagePath: "/images/regular-fit-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#20354d", imagePath: "/images/regular-fit-tshirt-navy-blue.jpg" },
          { name: "Brown", hex: "#6f4b2f", imagePath: "/images/regular-fit-tshirt-brown.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 106 },
          { min: 1000, max: 4999, price: 103 },
          { min: 5000, price: 100 },
        ],
      },
    ],
    features: [
      { title: "100% Cotton", description: "Comfort-first staple for daily use", icon: "Sprout" },
      { title: "Export Quality", description: "Clean seams and durable finishing", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Scaled production with consistency", icon: "Factory" },
      { title: "Fast Dispatch", description: "Rapid dispatch for repeat orders", icon: "Truck" },
      { title: "Custom Branding", description: "Screen-printing and embroidery options", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Nationwide shipping support", icon: "MapPinned" },
    ],
    relatedSlugs: ["oversized-t-shirts", "polo-t-shirts", "shorts", "joggers"],
  },
  {
    slug: "polo-t-shirts",
    name: "Polo T-Shirts",
    category: "Polos",
    tagline: "Elevated basics for premium uniforms and merchandising",
    moq: "100 Pieces",
    fabric: "Pique Cotton",
    gsmRange: "220-240 GSM",
    description:
      "A structured collar and refined knit make this polo ideal for hospitality, corporate gifting, and premium apparel lines.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "8-12 working days",
    heroImage: "/images/polo-tshirt-maroon.jpg",
    colors: [
      { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
      { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
      { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
      { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/polo-tshirt-dark-blue.jpg" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/polo-tshirt-maroon.jpg" },
      { name: "Orange", hex: "#c96a17", imagePath: "/images/polo-tshirt-orange.jpg" },
      { name: "Red", hex: "#a52424", imagePath: "/images/polo-tshirt-red.jpg" },
      { name: "Brown", hex: "#6f4b2f", imagePath: "/images/polo-tshirt-brown.jpg" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/polo-tshirt-grey.jpg" },
      { name: "Yellow", hex: "#f2c94c", imagePath: "/images/polo-tshirt-yellow.jpg" },
      { name: "Dark Yellow", hex: "#b88c12", imagePath: "/images/polo-tshirt-dark-yellow.jpg" },
      { name: "Purple", hex: "#6b3fa0", imagePath: "/images/polo-tshirt-purple.jpg" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    pricing: [
      { min: 100, max: 999, price: 112 },
      { min: 1000, max: 4999, price: 109 },
      { min: 5000, price: 106 },
    ],
    variants: [
      {
        id: "polo-140-cotton",
        name: "140 GSM Cotton",
        gsmRange: "140 GSM",
        fabric: "Cotton",
        description: "A lightweight polo crafted for premium casualwear and soft everyday branding.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
      },
      {
        id: "polo-220-pique-cotton",
        name: "220 GSM Pique Cotton",
        gsmRange: "220 GSM",
        fabric: "Pique Cotton",
        description: "A polished pique polo ideal for hospitality uniforms, corporate gifting, and premium merchandising.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/polo-tshirt-dark-blue.jpg" },
          { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/polo-tshirt-maroon.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 112 },
          { min: 1000, max: 4999, price: 109 },
          { min: 5000, price: 106 },
        ],
      },
      {
        id: "polo-220-dual-tipping",
        name: "220 GSM Dual Tipping Polo",
        gsmRange: "220 GSM",
        fabric: "Cotton Dual Tipping",
        description: "A refined dual tipping polo with contrast collar and sleeve detail for premium teamwear and apparel branding.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 116 },
          { min: 1000, max: 4999, price: 113 },
          { min: 5000, price: 110 },
        ],
      },
      {
        id: "polo-240-pique-cotton",
        name: "240 GSM Pique Cotton",
        gsmRange: "240 GSM",
        fabric: "Pique Cotton",
        description: "A premium heavyweight pique polo with refined texture and elevated branding presentation.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Navy Blue", hex: "#22334d", imagePath: "/images/polo-tshirt-navy-blue.jpg" },
          { name: "Black", hex: "#111111", imagePath: "/images/polo-tshirt-black.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 118 },
          { min: 1000, max: 4999, price: 115 },
          { min: 5000, price: 112 },
        ],
      },
      {
        id: "polo-240-tipping",
        name: "240 GSM Tipping Polo",
        gsmRange: "240 GSM",
        fabric: "Cotton Tipping",
        description: "A premium tipping polo boasting a crisp collar, refined knit, and polished silhouette.",
        heroImage: "/images/polo-tshirt-white.jpg",
        thumbnailImage: "/images/polo-tshirt-white.jpg",
        colors: [
          { name: "White", hex: "#f5f5f2", imagePath: "/images/polo-tshirt-white.jpg" },
          { name: "Royal Blue", hex: "#1f3b64", imagePath: "/images/polo-tshirt-dark-blue.jpg" },
          { name: "Red", hex: "#a52424", imagePath: "/images/polo-tshirt-red.jpg" },
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        moq: "100 Pieces",
        pricing: [
          { min: 100, max: 999, price: 126 },
          { min: 1000, max: 4999, price: 122 },
          { min: 5000, price: 118 },
        ],
      },
    ],
    features: [
      { title: "Pique Cotton", description: "Structured, breathable and luxurious", icon: "Sprout" },
      { title: "Export Quality", description: "Premium stitching and presentation", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Ideal for large reorders and seasons", icon: "Factory" },
      { title: "Fast Dispatch", description: "Reliable lead times for B2B clients", icon: "Truck" },
      { title: "Custom Branding", description: "Embroidery and monogram options", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Pan-India fulfilment support", icon: "MapPinned" },
    ],
    relatedSlugs: ["regular-fit-t-shirts", "shorts", "joggers", "polo-t-shirts"],
  },
  {
    slug: "shorts",
    name: "Shorts",
    category: "Activewear",
    tagline: "Lightweight comfort designed for warm-weather production",
    moq: "100 Pieces",
    fabric: "Cotton / Jersey",
    gsmRange: "180-220 GSM",
    description:
      "Versatile shorts with a premium finish for sportswear, uniforms, and promotional apparel collections.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "6-8 working days",
    heroImage: "/images/shorts-navy-blue.jpeg",
    colors: [
      { name: "Bottle Green", hex: "#3f6b3f", imagePath: "/images/shorts-bottle-green.jpeg" },
      { name: "Black", hex: "#111111", imagePath: "/images/shorts-black.jpeg" },
      { name: "Air Force Blue", hex: "#5d8aa8", imagePath: "/images/shorts-air-force-blue.jpeg" },
      { name: "Navy Blue", hex: "#22334d", imagePath: "/images/shorts-navy-blue.jpeg" },
      { name: "Dark Grey", hex: "#4b5563", imagePath: "/images/shorts-dark-grey.jpeg" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/shorts-maroon.jpeg" },
      { name: "Olive", hex: "#6b6e2d", imagePath: "/images/shorts-olive.jpeg" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 86 },
      { min: 1000, max: 4999, price: 82 },
      { min: 5000, price: 78 },
    ],
    features: [
      { title: "Breathable Fabric", description: "Comfortable for daily wear and active use", icon: "Sprout" },
      { title: "Bulk Production", description: "Scalable manufacturing for seasonal campaigns", icon: "Factory" },
      { title: "Premium Finish", description: "Structured look with clean detailing", icon: "ShieldCheck" },
    ],
    relatedSlugs: ["joggers", "shorts", "regular-fit-t-shirts", "polo-t-shirts"],
  },
  {
    slug: "joggers",
    name: "Joggers",
    category: "Activewear",
    tagline: "Performance-ready comfort with a luxury finish",
    moq: "100 Pieces",
    fabric: "Cotton / Polyester",
    gsmRange: "240-280 GSM",
    description:
      "Tailored for sportswear, lounge apparel, and premium athleisure, these joggers combine softness with a polished silhouette.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "8-10 working days",
    heroImage: "/images/joggers-white.jpeg",
    colors: [
      { name: "Bottle Green", hex: "#3f6b3f", imagePath: "/images/joggers-bottle-green.png" },
      { name: "Black", hex: "#111111", imagePath: "/images/joggers-black.png" },
      { name: "Air Force Blue", hex: "#5d8aa8", imagePath: "/images/joggers-air-force-blue.png" },
      { name: "Navy Blue", hex: "#22334d", imagePath: "/images/joggers-navy-blue.png" },
      { name: "Dark Grey", hex: "#4b5563", imagePath: "/images/joggers-dark-grey.jpeg" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/joggers-maroon.png" },
      { name: "Olive", hex: "#6b6e2d", imagePath: "/images/joggers-olive.png" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 102 },
      { min: 1000, max: 4999, price: 98 },
      { min: 5000, price: 95 },
    ],
    features: [
      { title: "Comfort Fit", description: "An easy, premium silhouette for all-day wear", icon: "Sprout" },
      { title: "Athleisure Ready", description: "Built for movement and style", icon: "Sparkles" },
      { title: "Bulk Friendly", description: "Reliable production for repeat orders", icon: "Factory" },
    ],
    relatedSlugs: ["shorts", "regular-fit-t-shirts", "polo-t-shirts", "corporate-wear"],
  },
  {
    slug: "corporate-wear",
    name: "Corporate Wear",
    category: "Corporate",
    tagline: "Professional apparel with a refined B2B finish",
    moq: "100 Pieces",
    fabric: "Cotton / Poly Blends",
    gsmRange: "180-220 GSM",
    description:
      "Elegant and durable apparel for staff uniforms, branded corporate programs, and premium office wear.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "10-14 working days",
    heroImage: "/images/co-orporate-wear.jpg",
    colors: [],
    sizes: [],
    pricing: [],
    features: [
      { title: "Branding Ready", description: "Embroidery, screen print and logo placement", icon: "BadgeCheck" },
      { title: "Professional Finish", description: "Structured, polished and durable", icon: "ShieldCheck" },
      { title: "Bulk Support", description: "Ideal for corporate launches and staff programs", icon: "Factory" },
    ],
    relatedSlugs: ["uniforms", "custom-merchandise"],
    inquiryOnly: true,
  },
  {
    slug: "uniforms",
    name: "Uniforms",
    category: "Uniforms",
    tagline: "Reliable uniforms tailored for teams and operations",
    moq: "150 Pieces",
    fabric: "Cotton / Twill",
    gsmRange: "220-260 GSM",
    description:
      "Durable, clean and scalable uniforms for hospitality, retail, logistics and team-based operations.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "10-14 working days",
    heroImage: "/images/uniformss.jpg",
    colors: [],
    sizes: [],
    pricing: [],
    features: [
      { title: "Operational Ready", description: "Built for repeat use and consistent presentation", icon: "Factory" },
      { title: "Custom Branding", description: "Logo placement and embroidered details", icon: "BadgeCheck" },
      { title: "Premium Durability", description: "Long-lasting construction for daily operations", icon: "ShieldCheck" },
    ],
    relatedSlugs: ["corporate-wear", "custom-merchandise"],
    inquiryOnly: true,
  },
  {
    slug: "custom-merchandise",
    name: "Custom Merchandise",
    category: "Merchandise",
    tagline: "Branded apparel made for campaigns and gifting",
    moq: "100 Pieces",
    fabric: "Custom Fabric Options",
    gsmRange: "Varies by Product",
    description:
      "Flexible custom merchandise solutions for launches, giveaways, employee gifting, and premium event wear.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "12-16 working days",
    heroImage: "/images/custom merchandise.jpg",
    colors: [],
    sizes: [],
    pricing: [],
    features: [
      { title: "Fully Custom", description: "Tailored to your campaign, brand and audience", icon: "BadgeCheck" },
      { title: "Premium Finish", description: "Polished presentation for gifting and events", icon: "Sparkles" },
      { title: "Flexible MOQ", description: "Support for smaller launches and large campaigns", icon: "Factory" },
    ],
    relatedSlugs: ["corporate-wear", "uniforms"],
    inquiryOnly: true,
  },
];

export const products: ProductDetail[] = baseProducts.map((product) => {
  const enrichedProduct = {
    ...product,
    description: enrichDescription(product.description),
    variants: product.variants?.map((variant) => ({
      ...variant,
      description: enrichDescription(variant.description),
    })),
  };

  if (!product.colors.length) {
    return enrichedProduct;
  }

  return {
    ...enrichedProduct,
    colors: buildAvailableColors(product.colors, product.colors[0]?.imagePath ?? product.heroImage, {
      categorySlug: product.slug,
      productSlug: product.slug,
      productName: product.name,
      fabric: product.fabric,
      gsmRange: product.gsmRange,
    }),
    variants: enrichedProduct.variants?.map((variant) => ({
      ...variant,
      colors: buildAvailableColors([], variant.heroImage ?? product.heroImage, {
        categorySlug: product.slug,
        productSlug: product.slug,
        productName: product.name,
        fabric: variant.fabric,
        gsmRange: variant.gsmRange,
        variantName: variant.name,
        variantSlug: variant.id,
      }),
    })),
  };
});

export const productsBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProductBySlug(slug: string) {
  return productsBySlug.get(slug) ?? null;
}
