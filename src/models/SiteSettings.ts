import mongoose, { Schema, Document, Model } from "mongoose";

export interface SiteSettingsDocument extends Document {
  contactEmail: string;
  phoneNumber: string;
  whatsAppNumber: string;
  defaultMoq: string;
  productionLeadTime: string;
  updatedAt: Date;
  createdAt: Date;
}

const SiteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    whatsAppNumber: { type: String, required: true, trim: true },
    defaultMoq: { type: String, required: true, trim: true },
    productionLeadTime: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const SiteSettings: Model<SiteSettingsDocument> =
  mongoose.models.SiteSettings || mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
