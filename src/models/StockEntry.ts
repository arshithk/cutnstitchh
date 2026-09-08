import mongoose, { Schema, Document, Model } from "mongoose";

export interface StockColorVariant {
  color: string;
  hex: string;
  quantity: number;
}

export interface StockEntryDocument extends Document {
  slug: string;
  productName: string;
  productType: string;
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: StockColorVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const StockColorVariantSchema = new Schema<StockColorVariant>(
  {
    color: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const StockEntrySchema = new Schema<StockEntryDocument>(
  {
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    productName: { type: String, required: true, trim: true },
    productType: { type: String, required: true, trim: true },
    fabric: { type: String, required: true, trim: true },
    gsmRange: { type: String, required: true, trim: true },
    lastUpdated: { type: String, required: true, trim: true },
    availableForBulk: { type: Boolean, required: true, default: true },
    colors: { type: [StockColorVariantSchema], required: true, default: [] },
  },
  {
    timestamps: true,
  },
);

const StockEntry: Model<StockEntryDocument> =
  mongoose.models.StockEntry || mongoose.model<StockEntryDocument>("StockEntry", StockEntrySchema);

export default StockEntry;
