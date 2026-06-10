"use server";

import { connectDB } from "@/lib/db";
import { Message } from "@/models/message";

export async function submitInquiry(formData: FormData) {
  const listingId = formData.get("listingId") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !phone) {
    return { error: "Name and phone are required." };
  }

  try {
    await connectDB();
    await Message.create({ listingId, sellerId: "mock", name, phone, message });
    return { success: true };
  } catch {
    return { error: "Failed to send inquiry." };
  }
}
