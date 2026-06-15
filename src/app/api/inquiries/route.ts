import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/message";
import { addInquiry, getInquiriesForSeller } from "@/lib/inquiry-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, sellerId, name, phone, message, cattleName, cattleBreed } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 },
      );
    }

    try {
      await connectDB();
      await Message.create({
        listingId,
        sellerId: sellerId || "mock",
        name,
        phone,
        message: message || "",
      });
    } catch {
      const added = addInquiry({
        listingId: listingId || "",
        sellerId: sellerId || "mock",
        buyerName: name,
        buyerPhone: phone,
        message: message || "",
        cattleName: cattleName || "",
        cattleBreed: cattleBreed || "",
      });
      return NextResponse.json({ success: true, inquiry: added });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send inquiry." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sellerId = url.searchParams.get("sellerId");

  if (!sellerId) {
    return NextResponse.json({ error: "sellerId is required" }, { status: 400 });
  }

  const items = getInquiriesForSeller(sellerId);
  return NextResponse.json({ inquiries: items });
}
