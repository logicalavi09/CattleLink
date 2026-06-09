"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, Heart, MapPin, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { deleteCattleListing, toggleSoldStatus } from "@/app/actions/cattle";
import type { DashboardCattleItem } from "./page";

export function DashboardCard({ item }: { item: DashboardCattleItem }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    startTransition(() => { void deleteCattleListing(item._id); });
  };

  const handleToggleSold = () => {
    startTransition(() => { void toggleSoldStatus(item._id, !item.isSold); });
  };

  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] border shadow-sm transition ${
        item.isSold
          ? "border-slate-200 bg-slate-50 opacity-80"
          : "border-brand-100 bg-white hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden ${
          item.isSold
            ? "bg-gradient-to-br from-slate-500 to-slate-600"
            : "bg-gradient-to-br from-brand-700 via-brand-600 to-earth-500"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,243,219,0.2),transparent_28%)]" />

        {item.isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-lg font-bold text-white backdrop-blur">
              <CheckCircle className="h-5 w-5" />
              Sold
            </span>
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur">
          <p className="text-sm font-medium text-white/85">{item.type}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">{item.breed}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-700">
            {item.type}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-900">
            {formatPrice(item.price)}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-earth-500" />
            <span>{item.location}</span>
          </div>
        </div>

        {/* Analytics row */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {item.views} views
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {item.interestCount} interested
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/sell?id=${item._id}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3 text-sm font-medium text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleToggleSold}
            disabled={isPending}
            className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-medium shadow-sm transition ${
              item.isSold
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            } disabled:opacity-50`}
          >
            {item.isSold ? (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Mark Available
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Mark Sold
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
