import mongoose, { Schema, models } from "mongoose";

const QuoteSchema = new Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    printingMethod: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

export default models.Quote || mongoose.model("Quote", QuoteSchema);