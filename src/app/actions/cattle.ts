"use server";

import { auth } from "@clerk/nextjs/server";
import { connectDB, getConnectionError } from "@/lib/db";
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
  const listingId = formData.get("id") as string;

  if (!name || !type || !breed || !price || !location) {
    return { error: "Please fill in all required fields." };
  }

  try {
    const dbError = getConnectionError();
    if (dbError) {
      return { error: dbError };
    }

    await connectDB();

    const data = {
      sellerId: userId,
      name,
      type,
      breed,
      price,
      location,
      description,
      videoUrl,
    };

    if (listingId) {
      const existing = await Cattle.findById(listingId);
      if (!existing || existing.sellerId !== userId) {
        return { error: "Listing not found or unauthorized." };
      }
      await Cattle.findByIdAndUpdate(listingId, data);
    } else {
      await Cattle.create({ ...data, isSold: false });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create listing:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getCattleListing(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    await connectDB();
    const listing = await Cattle.findById(id).lean();
    if (!listing || listing.sellerId !== userId) return null;
    return {
      _id: listing._id.toString(),
      name: listing.name,
      type: listing.type,
      breed: listing.breed,
      price: listing.price,
      location: listing.location,
      description: listing.description,
      videoUrl: listing.videoUrl,
      isSold: listing.isSold,
      views: listing.views ?? 0,
      interestCount: listing.interestCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function deleteCattleListing(id: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectDB();
    const listing = await Cattle.findById(id);
    if (!listing || listing.sellerId !== userId) {
      return { error: "Not found or unauthorized" };
    }
    await Cattle.findByIdAndDelete(id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to delete listing" };
  }
}

export async function toggleSoldStatus(id: string, isSold: boolean) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await connectDB();
    const listing = await Cattle.findById(id);
    if (!listing || listing.sellerId !== userId) {
      return { error: "Not found or unauthorized" };
    }
    await Cattle.findByIdAndUpdate(id, { isSold });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to update listing" };
  }
}
