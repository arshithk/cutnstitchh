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
}

export const products: ProductDetail[] = [
  {
    slug: "oversized-t-shirts",
    name: "Oversized T-Shirts",
    category: "T-Shirts",
    tagline: "Statement silhouettes with premium comfort",
    moq: "100 Pieces",
    fabric: "100% Cotton",
    gsmRange: "220-280 GSM",
    description:
      "Crafted for modern streetwear and premium retail capsules, these oversized tees balance softness, durability, and effortless structure.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "7-10 working days",
    heroImage: "/images/oversized_tshirt_model.png",
    colors: [
      { name: "Black", hex: "#0f1115", imagePath: "/images/oversized_tshirt_model.png" },
      { name: "White", hex: "#f5f5f2", imagePath: "/images/oversized_tshirt_model.png" },
      { name: "Olive", hex: "#6b7140", imagePath: "/images/oversized_tshirt_model.png" },
      { name: "Navy", hex: "#20354d", imagePath: "/images/oversized_tshirt_model.png" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/oversized_tshirt_model.png" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    pricing: [
      { min: 100, max: 999, price: 105 },
      { min: 1000, max: 4999, price: 103 },
      { min: 5000, price: 100 },
    ],
    features: [
      { title: "100% Cotton", description: "Soft, breathable and ideal for premium wear", icon: "Sprout" },
      { title: "Export Quality", description: "Finished to international apparel standards", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Reliable scale with consistent finishing", icon: "Factory" },
      { title: "Fast Dispatch", description: "Quick turnaround for urgent bulk orders", icon: "Truck" },
      { title: "Custom Branding", description: "Screen-printing, embroidery and labels available", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Efficient dispatch from our production hub", icon: "MapPinned" },
    ],
    relatedSlugs: ["regular-fit-t-shirts", "hoodies", "sweatshirts", "polo-t-shirts"],
  },
  {
    slug: "regular-fit-t-shirts",
    name: "Regular Fit T-Shirts",
    category: "T-Shirts",
    tagline: "Everyday essentials with a refined finish",
    moq: "100 Pieces",
    fabric: "100% Cotton",
    gsmRange: "180-200 GSM",
    description:
      "A polished base layer for uniforms, promotional apparel, and daily wear, with crisp construction and soft hand feel.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "6-8 working days",
    heroImage: "/images/men_tshirt_model.png",
    colors: [
      { name: "Black", hex: "#111111", imagePath: "/images/men_tshirt_model.png" },
      { name: "White", hex: "#f7f7f2", imagePath: "/images/men_tshirt_model.png" },
      { name: "Charcoal", hex: "#4a4a4a", imagePath: "/images/men_tshirt_model.png" },
      { name: "Mint", hex: "#7db89a", imagePath: "/images/men_tshirt_model.png" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 98 },
      { min: 1000, max: 4999, price: 95 },
      { min: 5000, price: 92 },
    ],
    features: [
      { title: "100% Cotton", description: "Comfort-first staple for daily use", icon: "Sprout" },
      { title: "Export Quality", description: "Clean seams and durable finishing", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Scaled production with consistency", icon: "Factory" },
      { title: "Fast Dispatch", description: "Rapid dispatch for repeat orders", icon: "Truck" },
      { title: "Custom Branding", description: "Screen-printing and embroidery options", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Nationwide shipping support", icon: "MapPinned" },
    ],
    relatedSlugs: ["oversized-t-shirts", "polo-t-shirts", "sweatshirts", "tracksuits"],
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
    heroImage: "/images/polo_tshirt.webp",
    colors: [
      { name: "Navy", hex: "#22334d", imagePath: "/images/polo_tshirt.webp" },
      { name: "Black", hex: "#111111", imagePath: "/images/polo_tshirt.webp" },
      { name: "White", hex: "#f5f5f2", imagePath: "/images/polo_tshirt.webp" },
      { name: "Olive", hex: "#6e7140", imagePath: "/images/polo_tshirt.webp" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 112 },
      { min: 1000, max: 4999, price: 109 },
      { min: 5000, price: 106 },
    ],
    features: [
      { title: "Pique Cotton", description: "Structured, breathable and luxurious", icon: "Sprout" },
      { title: "Export Quality", description: "Premium stitching and presentation", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Ideal for large reorders and seasons", icon: "Factory" },
      { title: "Fast Dispatch", description: "Reliable lead times for B2B clients", icon: "Truck" },
      { title: "Custom Branding", description: "Embroidery and monogram options", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Pan-India fulfilment support", icon: "MapPinned" },
    ],
    relatedSlugs: ["regular-fit-t-shirts", "hoodies", "sweatshirts", "tracksuits"],
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    category: "Sweatwear",
    tagline: "Luxe layering for cold-weather collections",
    moq: "100 Pieces",
    fabric: "Fleece / Terry",
    gsmRange: "320-400 GSM",
    description:
      "Heavyweight fleece hoodies designed for comfort, warmth, and premium brand presentation in every bulk order.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "10-14 working days",
    heroImage: "/images/hoodie_model.png",
    colors: [
      { name: "Black", hex: "#111111", imagePath: "/images/hoodie_model.png" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/hoodie_model.png" },
      { name: "Maroon", hex: "#6d2c2c", imagePath: "/images/hoodie_model.png" },
      { name: "Olive", hex: "#5f6d35", imagePath: "/images/hoodie_model.png" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 145 },
      { min: 1000, max: 4999, price: 140 },
      { min: 5000, price: 136 },
    ],
    features: [
      { title: "Premium Fleece", description: "Warm, heavy and comfortable", icon: "Snowflake" },
      { title: "Export Quality", description: "Tailored finish for premium brands", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Built for seasonal volume", icon: "Factory" },
      { title: "Fast Dispatch", description: "Flexible production planning", icon: "Truck" },
      { title: "Custom Branding", description: "Embroidery and chest branding", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Reliable pan-India fulfilment", icon: "MapPinned" },
    ],
    relatedSlugs: ["oversized-t-shirts", "sweatshirts", "tracksuits", "polo-t-shirts"],
  },
  {
    slug: "sweatshirts",
    name: "Sweatshirts",
    category: "Sweatwear",
    tagline: "Soft texture, structured silhouette, premium comfort",
    moq: "100 Pieces",
    fabric: "French Terry",
    gsmRange: "280-340 GSM",
    description:
      "Styled for premium casualwear and corporate merch, these sweatshirts offer refined texture and dependable bulk production.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "8-10 working days",
    heroImage: "/images/sweatshirt_model.png",
    colors: [
      { name: "Cream", hex: "#e8d8c2", imagePath: "/images/sweatshirt_model.png" },
      { name: "Black", hex: "#111111", imagePath: "/images/sweatshirt_model.png" },
      { name: "Navy", hex: "#22334d", imagePath: "/images/sweatshirt_model.png" },
      { name: "Sand", hex: "#c2a37c", imagePath: "/images/sweatshirt_model.png" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 138 },
      { min: 1000, max: 4999, price: 134 },
      { min: 5000, price: 130 },
    ],
    features: [
      { title: "French Terry", description: "Soft hand feel with a premium drape", icon: "Sprout" },
      { title: "Export Quality", description: "Built for premium brand standards", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Efficient production for larger batches", icon: "Factory" },
      { title: "Fast Dispatch", description: "Agile turnaround for season launches", icon: "Truck" },
      { title: "Custom Branding", description: "Screen print, embroidery and woven labels", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Reliable logistics across India", icon: "MapPinned" },
    ],
    relatedSlugs: ["hoodies", "regular-fit-t-shirts", "tracksuits", "oversized-t-shirts"],
  },
  {
    slug: "tracksuits",
    name: "Tracksuits",
    category: "Sportswear",
    tagline: "Refined athleticwear for performance and retail",
    moq: "150 Sets",
    fabric: "Polyester Blend",
    gsmRange: "260-320 GSM",
    description:
      "Athleisure-ready tracksuits with premium detailing, strong structure, and excellent scale for bulk production.",
    availableForBulk: true,
    premiumQuality: true,
    deliveryTimeline: "10-12 working days",
    heroImage: "/images/tracksuit.webp",
    colors: [
      { name: "Black", hex: "#111111", imagePath: "/images/tracksuit.webp" },
      { name: "Navy", hex: "#22334d", imagePath: "/images/tracksuit.webp" },
      { name: "Grey", hex: "#6b7280", imagePath: "/images/tracksuit.webp" },
      { name: "Wine", hex: "#5b2338", imagePath: "/images/tracksuit.webp" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    pricing: [
      { min: 100, max: 999, price: 168 },
      { min: 1000, max: 4999, price: 162 },
      { min: 5000, price: 158 },
    ],
    features: [
      { title: "Athleisure Fabric", description: "Stretch-forward and performance-ready", icon: "Sparkles" },
      { title: "Export Quality", description: "Strong seams and premium finishing", icon: "ShieldCheck" },
      { title: "Bulk Manufacturing", description: "Designed for volume and repeat orders", icon: "Factory" },
      { title: "Fast Dispatch", description: "Efficient delivery planning", icon: "Truck" },
      { title: "Custom Branding", description: "Custom trims and branding options", icon: "BadgeCheck" },
      { title: "PAN India Delivery", description: "Seamless nationwide shipping", icon: "MapPinned" },
    ],
    relatedSlugs: ["hoodies", "sweatshirts", "polo-t-shirts", "regular-fit-t-shirts"],
  },
];

export const productsBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProductBySlug(slug: string) {
  return productsBySlug.get(slug) ?? null;
}
