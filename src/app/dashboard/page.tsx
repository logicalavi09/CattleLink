import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Cattle } from "@/models/cattle";
import { DashboardCard } from "./dashboard-card";
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

  await connectDB();
  const listings = await Cattle.find({ sellerId: userId })
    .sort({ createdAt: -1 })
    .lean();

  const totalListings = listings.length;
  const isVerified = totalListings > 3;

  const items: DashboardCattleItem[] = listings.map((l) => ({
    _id: l._id.toString(),
    name: l.name,
    type: l.type,
    breed: l.breed,
    price: l.price,
    location: l.location,
    description: l.description,
    isSold: l.isSold,
    views: l.views ?? 0,
    interestCount: l.interestCount ?? 0,
    createdAt: l.createdAt,
  }));

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">My Listings</h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Verified Seller
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage your cattle listings — edit details, mark as sold, or remove them.
          </p>
          <div className="mt-4 flex gap-4">
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">{totalListings}</p>
              <p className="text-xs text-slate-500">Total listings</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">
                {items.filter((i) => !i.isSold).length}
              </p>
              <p className="text-xs text-slate-500">Active listings</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-2xl font-bold text-ink-900">
                ₹{items.filter((i) => !i.isSold).reduce((s, i) => s + i.price, 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500">Potential revenue</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <Sprout className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink-900">
              No listings yet
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create your first cattle listing to start selling on PashuMarket.
            </p>
            <Link
              href="/sell"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              List your cattle
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <DashboardCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
