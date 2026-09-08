import mongoose, { Schema, Document, Model } from "mongoose";

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

export interface ProductVariant {
  slug: string;
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
  printingCompatibility?: string;
  embroideryCompatibility?: string;
}

export interface ProductDocument extends Document {
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
  inquiryOnly: boolean;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductColorSchema = new Schema<ProductColor>(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
    imagePath: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ProductPricingSchema = new Schema<ProductPricingTier>(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: false, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const ProductFeatureSchema = new Schema<ProductFeature>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    gsmRange: { type: String, required: true, trim: true },
    fabric: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true, trim: true },
    thumbnailImage: { type: String, trim: true },
    colors: { type: [ProductColorSchema], required: true, default: [] },
    sizes: { type: [String], required: true, default: [] },
    moq: { type: String, required: true, trim: true },
    pricing: { type: [ProductPricingSchema], required: false, default: [] },
    printingCompatibility: { type: String, trim: true },
    embroideryCompatibility: { type: String, trim: true },
  },
  { _id: false },
);

const ProductSchema = new Schema<ProductDocument>(
  {
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    moq: { type: String, required: true, trim: true },
    fabric: { type: String, required: true, trim: true },
    gsmRange: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    availableForBulk: { type: Boolean, required: true, default: true },
    premiumQuality: { type: Boolean, required: true, default: false },
    deliveryTimeline: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true, trim: true },
    colors: { type: [ProductColorSchema], required: true, default: [] },
    sizes: { type: [String], required: true, default: [] },
    pricing: { type: [ProductPricingSchema], required: true, default: [] },
    features: { type: [ProductFeatureSchema], required: true, default: [] },
    relatedSlugs: { type: [String], required: true, default: [] },
    inquiryOnly: { type: Boolean, required: true, default: false },
    variants: { type: [ProductVariantSchema], required: false, default: [] },
  },
  {
    timestamps: true,
  },
);

const Product: Model<ProductDocument> =
  mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
