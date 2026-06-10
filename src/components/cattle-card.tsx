import Link from "next/link";
import Image from "next/image";
import { MapPin, Navigation, PlayCircle, ShieldCheck } from "lucide-react";

import { formatPrice } from "@/lib/format";
import type { CattleListing } from "@/models/cattle";
import { formatDistance } from "@/lib/geo";

interface Props {
  listing: CattleListing;
  distance?: number;
}

export function CattleCard({ listing, distance }: Props) {
  return (
    <Link href={`/cattle/${listing.id}`}>
      <article className="overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-earth-500">
          {listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={listing.breed}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,243,219,0.2),transparent_28%)]" />
          )}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <PlayCircle className="h-3.5 w-3.5" />
              {listing.mediaLabel}
            </span>
            <div className="flex items-center gap-1.5">
              {distance != null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <Navigation className="h-3 w-3" />
                  {formatDistance(distance)}
                </span>
              )}
              {listing.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Featured
                </span>
              ) : null}
            </div>
          </div>

          {!listing.thumbnailUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur">
                <PlayCircle className="h-10 w-10" />
              </div>
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/85">{listing.statusLabel}</p>
              {listing.sellerRating && listing.sellerRating > 4.5 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-lg font-semibold tracking-tight">{listing.breed}</p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-700">{listing.category}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-900">
              {formatPrice(listing.price)}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-earth-500" />
              <span>{listing.breed}</span>
              <span className="text-slate-400">-</span>
              <span>{listing.location}</span>
            </div>
          </div>

          <span className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-white transition hover:bg-brand-700">
            View Details
          </span>
        </div>
      </article>
    </Link>
  );
}
