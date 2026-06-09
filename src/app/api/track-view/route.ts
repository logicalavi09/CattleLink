import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Cattle } from "@/models/cattle";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (id.length === 24) {
      await connectDB();
      await Cattle.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
