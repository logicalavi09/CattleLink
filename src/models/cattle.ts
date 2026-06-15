import mongoose, { Schema, Document, Model } from "mongoose";
import type { LucideIcon } from "lucide-react";

export type CattleCategoryName = "Cow" | "Buffalo" | "Goat" | "Sheep" | "Other";

export interface CattleCategory {
  name: CattleCategoryName;
  description: string;
  icon: LucideIcon;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface CattleListing {
  id: string;
  title?: string;
  category: CattleCategoryName;
  breed: string;
  location: string;
  price: number;
  mediaLabel: string;
  statusLabel: string;
  featured: boolean;
  sellerId?: string;
  sellerName?: string;
  sellerRating?: number;
  description?: string;
  age?: string;
  milkYield?: string;
  vaccinationStatus?: string;
  latitude?: number;
  longitude?: number;
  thumbnailUrl?: string;
  views?: number;
  interestCount?: number;
  reviews?: Review[];
}

export interface ICattle extends Document {
  sellerId: string;
  name: string;
  type: string;
  breed: string;
  price: number;
  location: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  isSold: boolean;
  views: number;
  interestCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CattleSchema = new Schema<ICattle>(
  {
    sellerId: { type: String, required: true },
    name: { type: String },
    type: { type: String },
    breed: { type: String },
    price: { type: Number },
    location: { type: String },
    description: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    isSold: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    interestCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Cattle: Model<ICattle> =
  mongoose.models.Cattle || mongoose.model<ICattle>("Cattle", CattleSchema);
