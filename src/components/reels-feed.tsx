"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { X, Phone, MessageCircle, Heart, Volume2, VolumeX, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { MockCattleListing } from "@/constants/mockCattle";

const LOAD_TIMEOUT_MS = 10_000;

function ReelCard({
  listing,
  isActive,
}: {
  listing: MockCattleListing;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const prevActive = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => clearLoadTimeout();
  }, []);

  useEffect(() => {
    if (state === "loading" && videoRef.current) {
      clearLoadTimeout();
      timeoutRef.current = setTimeout(() => {
        setState((s) => (s === "loading" ? "error" : s));
      }, LOAD_TIMEOUT_MS);
    }
    return () => clearLoadTimeout();
  }, [state]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !prevActive.current) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else if (!isActive && prevActive.current) {
      video.pause();
    }

    prevActive.current = isActive;
  }, [isActive]);

  const handleLoad = () => {
    clearLoadTimeout();
    setState("ready");
  };

  const handleError = () => {
    clearLoadTimeout();
    setState("error");
    console.error("Video failed to load:", listing.videoUrl);
  };

  const retry = () => {
    const video = videoRef.current;
    if (!video) return;
    setState("loading");
    video.load();
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black">
      {state === "loading" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            <p className="text-sm text-white/40">Loading video...</p>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black px-6">
          <div className="rounded-full bg-white/10 p-4">
            <VolumeX className="h-8 w-8 text-white/40" />
          </div>
          <p className="text-center text-sm text-white/50">
            Video could not be loaded.
          </p>
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src={listing.videoUrl}
        muted={muted}
        loop
        autoPlay
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        style={{ zIndex: 1, position: "relative" }}
        onCanPlay={handleLoad}
        onLoadedData={handleLoad}
        onError={handleError}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        style={{ zIndex: 5, pointerEvents: "none" }}
      />

      <Link
        href="/"
        className="absolute left-4 top-12 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-90"
        style={{ zIndex: 20 }}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Link>

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute right-4 top-12 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-90"
        style={{ zIndex: 20 }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      <div
        className="absolute bottom-0 left-0 right-0 p-5 pb-10"
        style={{ zIndex: 20, pointerEvents: "none" }}
      >
        <div className="flex items-end justify-between">
          <div className="space-y-1" style={{ pointerEvents: "auto" }}>
            <p className="text-sm font-medium text-white/80">{listing.category}</p>
            <h2 className="text-xl font-bold text-white">{listing.breed}</h2>
            <p className="text-2xl font-bold text-brand-300">
              {formatPrice(listing.price)}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <span>{listing.location}</span>
              <span className="text-white/30">•</span>
              <span>{listing.sellerName}</span>
            </div>
            {listing.description && (
              <p className="max-w-xs text-xs leading-relaxed text-white/60">
                {listing.description}
              </p>
            )}
          </div>

          <div
            className="flex flex-col items-center gap-4"
            style={{ pointerEvents: "auto" }}
          >
            <button
              type="button"
              onClick={() => setLiked((l) => !l)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition active:scale-90 ${
                  liked
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/40"
                    : "bg-white/20 text-white"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
                />
              </span>
              <span className="text-[10px] font-medium text-white/70">Like</span>
            </button>

            <a
              href={`tel:+919999999999`}
              className="flex flex-col items-center gap-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition active:scale-90">
                <Phone className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-white/70">Call</span>
            </a>

            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(`Interested in ${listing.breed} - ${formatPrice(listing.price)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition active:scale-90">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-white/70">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReelsFeed({
  listings,
}: {
  listings: MockCattleListing[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-black"
      style={{ scrollBehavior: "smooth" }}
    >
      {listings.map((listing, i) => (
        <ReelCard key={listing.id} listing={listing} isActive={i === activeIndex} />
      ))}
    </div>
  );
}
