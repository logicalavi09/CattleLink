import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/message";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, name, phone, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 },
      );
    }

    await connectDB();
    await Message.create({
      listingId,
      sellerId: "mock",
      name,
      phone,
      message: message || "",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send inquiry." },
      { status: 500 },
    );
  }
}
