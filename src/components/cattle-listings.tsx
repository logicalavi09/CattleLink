"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, Grid3x3, Map as MapIcon, XCircle, Crosshair } from "lucide-react";
import type { CattleListing } from "@/models/cattle";
import { CattleCard } from "./cattle-card";
import { MapView } from "./map-view";
import { haversineDistance } from "@/lib/geo";
import { useLanguage } from "@/lib/language-context";

interface Props {
  listings: CattleListing[];
  query?: string;
  category?: string;
  usedCategory?: string | null;
  usedQuery?: string;
}

export function CattleListings({ listings, query, category, usedCategory, usedQuery }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [geoSortEnabled, setGeoSortEnabled] = useState(false);

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
        setGeoSortEnabled(true);
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
    setGeoSortEnabled(false);
  };

  const handleToggleGeoSort = () => {
    if (geoSortEnabled) {
      handleClearLocation();
    } else {
      handleUseLocation();
    }
  };

  const displayLabel = () => {
    if (usedCategory && usedQuery) return `${usedCategory} mein "${usedQuery}" ke liye result`;
    if (usedCategory) return `${usedCategory} listings`;
    if (usedQuery) return `"${usedQuery}" ke liye result`;
    if (query) return `"${query}" ke liye result`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} listings`;
    return "";
  };

  const hasActiveFilter = !!(query || category || usedCategory || usedQuery);

  return (
    <section id="featured-listings" className="space-y-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleGeoSort}
              disabled={locLoading}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium shadow-sm transition disabled:opacity-50 ${
                geoSortEnabled
                  ? "border-brand-500 bg-brand-100 text-brand-700 ring-2 ring-brand-200"
                  : "border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
              }`}
            >
              {locLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crosshair className={`h-4 w-4 ${geoSortEnabled ? "animate-pulse" : ""}`} />
              )}
              <span className="hidden sm:inline">
                {geoSortEnabled ? "Paas Ke Janwar" : "Janwar Jo Mere Paas Hain"}
              </span>
              <span className="sm:hidden">
                {geoSortEnabled ? "Paas Ke" : "Paas Hain"}
              </span>
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
          {hasActiveFilter ? t("listings.search") : t("listings.featured")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          {displayLabel() || t("listings.recent")}
        </h2>
        {!hasActiveFilter && (
          <p className="max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
            {t("listings.description")}
          </p>
        )}
        {userLocation && sortedListings.length > 0 && (
          <p className="text-xs text-slate-500">
            {t("location.sorted")}
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
            {t("listings.empty")}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {t("listings.empty_hint")}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              <XCircle className="h-4 w-4" />
              Clear Search
            </button>
          )}
        </div>
      )}
    </section>
  );
}
