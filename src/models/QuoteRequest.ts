import mongoose, { Schema, Document, Model } from "mongoose";

export type QuoteStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface QuoteRequestDocument extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  message: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<QuoteRequestDocument>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const QuoteRequest: Model<QuoteRequestDocument> =
  mongoose.models.QuoteRequest || mongoose.model<QuoteRequestDocument>("QuoteRequest", QuoteRequestSchema);

export default QuoteRequest;
