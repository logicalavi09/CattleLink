"use client";

import { useState, useMemo } from "react";
import { MapPin, Navigation, Loader2, Grid3x3, Map as MapIcon } from "lucide-react";
import type { CattleListing } from "@/models/cattle";
import { CattleCard } from "./cattle-card";
import { MapView } from "./map-view";
import { haversineDistance, formatDistance } from "@/lib/geo";

interface Props {
  listings: CattleListing[];
  query?: string;
  category?: string;
}

export function CattleListings({ listings, query, category }: Props) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const listingsWithDistance = useMemo(() => {
    if (!userLocation) return listings.map((l) => ({ ...l, distance: null as number | null }));
    return listings.map((l) => {
      if (l.latitude != null && l.longitude != null) {
        return {
          ...l,
          distance: haversineDistance(userLocation.lat, userLocation.lng, l.latitude, l.longitude),
        };
      }
      return { ...l, distance: null as number | null };
    });
  }, [listings, userLocation]);

  const sortedListings = useMemo(() => {
    if (!userLocation) return listingsWithDistance;
    return [...listingsWithDistance].sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }, [listingsWithDistance, userLocation]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported");
      return;
    }
    setLocLoading(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocLoading(false);
      },
      (err) => {
        setLocError(err.message);
        setLocLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const handleClearLocation = () => {
    setUserLocation(null);
    setLocError(null);
  };

  return (
    <section id="featured-listings" className="space-y-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {userLocation ? (
            <button
              type="button"
              onClick={handleClearLocation}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
            >
              <Navigation className="h-3 w-3" />
              Location set
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locLoading}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3 text-sm font-medium text-brand-700 shadow-sm transition hover:bg-brand-50 disabled:opacity-50"
            >
              {locLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              Use My Location
            </button>
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-9 w-9 items-center justify-center transition ${
                  viewMode === "grid"
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex h-9 w-9 items-center justify-center transition ${
                  viewMode === "map"
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MapIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        {locError && (
          <p className="text-xs text-red-500">{locError}</p>
        )}

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth-600">
          {query ? "Search results" : "Featured listings"}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          {query
            ? `Results for "${query}"`
            : category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} listings`
              : "Recent cattle ready to explore"}
        </h2>
        {!query && !category && (
          <p className="max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
            These sample cards help shape the first marketplace experience. Replace them with
            live seller listings once the data layer is ready.
          </p>
        )}
        {userLocation && sortedListings.length > 0 && (
          <p className="text-xs text-slate-500">
            Sorted by distance &middot; nearest first
          </p>
        )}
      </div>

      {sortedListings.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sortedListings.map((listing) => (
              <CattleCard
                key={listing.id}
                listing={listing}
                distance={listing.distance ?? undefined}
              />
            ))}
          </div>
        ) : (
          <MapView
            listings={sortedListings}
            userLocation={userLocation}
            onSwitchToGrid={() => setViewMode("grid")}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-100 bg-white px-6 py-16 text-center shadow-sm">
          <MapPin className="h-8 w-8 text-earth-500" />
          <h3 className="mt-4 text-xl font-semibold text-ink-900">
            No listings found
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Try a different search or browse categories above.
          </p>
        </div>
      )}
    </section>
  );
}
