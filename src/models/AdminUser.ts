import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminRole = "admin" | "editor";

export interface AdminUserDocument extends Document {
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "editor"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

const AdminUser: Model<AdminUserDocument> =
  mongoose.models.AdminUser || mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);

export default AdminUser;
