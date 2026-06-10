import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  listingId: string;
  sellerId: string;
  name: string;
  phone: string;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    listingId: { type: String, required: true },
    sellerId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
