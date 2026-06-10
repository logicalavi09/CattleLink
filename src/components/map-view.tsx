"use client";

import { MapPin } from "lucide-react";
import type { CattleListing } from "@/models/cattle";
import { haversineDistance, formatDistance } from "@/lib/geo";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface Props {
  listings: (CattleListing & { distance: number | null })[];
  userLocation: { lat: number; lng: number } | null;
  onSwitchToGrid: () => void;
}

export function MapView({ listings, userLocation, onSwitchToGrid }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-100 bg-white p-4 text-center shadow-sm">
        <MapPin className="mx-auto h-8 w-8 text-brand-600" />
        <p className="mt-2 text-sm font-medium text-ink-900">
          {userLocation
            ? `${listings.length} cattle near your location`
            : "Enable location to see cattle near you"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Interactive map coming soon — showing list view below
        </p>
        <button
          type="button"
          onClick={onSwitchToGrid}
          className="mt-3 inline-flex h-8 items-center rounded-lg bg-brand-50 px-3 text-xs font-medium text-brand-700 hover:bg-brand-100"
        >
          Switch to grid view
        </button>
      </div>

      <div className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
        {listings.map((listing) => {
          const distance =
            userLocation &&
            listing.latitude != null &&
            listing.longitude != null
              ? haversineDistance(
                  userLocation.lat,
                  userLocation.lng,
                  listing.latitude,
                  listing.longitude,
                )
              : null;

          return (
            <Link
              key={listing.id}
              href={`/cattle/${listing.id}`}
              className="flex items-center gap-4 px-4 py-3 transition hover:bg-brand-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-earth-100">
                <MapPin className="h-5 w-5 text-brand-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {listing.title || listing.breed}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {listing.location} &middot; {listing.breed}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink-900">
                  {formatPrice(listing.price)}
                </p>
                {distance != null && (
                  <p className="text-xs text-brand-600">
                    {formatDistance(distance)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
