"use server";

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Cattle } from "@/models/cattle";
import { revalidatePath } from "next/cache";

export async function createCattleListing(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to list cattle." };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const breed = formData.get("breed") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;

  if (!name || !type || !breed || !price || !location) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await connectDB();

    await Cattle.create({
      sellerId: userId,
      name,
      type,
      breed,
      price,
      location,
      description,
      videoUrl,
      isSold: false,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create listing:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
