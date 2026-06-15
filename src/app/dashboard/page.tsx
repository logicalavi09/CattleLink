import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Cattle } from "@/models/cattle";
import { DashboardInquirySection } from "./dashboard-inquiry";
import { Sprout, Plus, ShieldCheck as ShieldCheckIcon } from "lucide-react";

export interface DashboardCattleItem {
  _id: string;
  name: string;
  type: string;
  breed: string;
  price: number;
  location: string;
  description?: string;
  isSold: boolean;
  views: number;
  interestCount: number;
  createdAt: Date;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  let listings: DashboardCattleItem[] = [];
  try {
    await connectDB();
    const docs = await Cattle.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .lean();
    listings = (docs as unknown as Array<Record<string, unknown>>).map((d) => ({
      _id: String(d._id),
      name: String(d.name || ""),
      type: String(d.type || ""),
      breed: String(d.breed || ""),
      price: Number(d.price || 0),
      location: String(d.location || ""),
      description: String(d.description || ""),
      isSold: Boolean(d.isSold),
      views: Number(d.views ?? 0),
      interestCount: Number(d.interestCount ?? 0),
      createdAt: d.createdAt as Date,
    }));
  } catch {
    // DB might be down — show empty
  }

  const totalListings = listings.length;
  const isVerified = totalListings > 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-earth-50">
      <header className="sticky top-0 z-40 border-b border-brand-100/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">PashuMarket</span>
          </Link>
          <Link
            href="/sell"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Listing
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">My Dashboard</h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Verified Seller
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Identity Verified
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">{totalListings}</p>
              <p className="text-xs text-slate-500">Total listings</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">
                {listings.filter((i) => !i.isSold).length}
              </p>
              <p className="text-xs text-slate-500">Active listings</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">
                ₹{listings.filter((i) => !i.isSold).reduce((s, i) => s + i.price, 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500">Potential revenue</p>
            </div>
          </div>
        </div>

        <DashboardInquirySection sellerId={userId} items={listings} />
      </main>
    </div>
  );
}
