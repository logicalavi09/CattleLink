"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Heart,
  Volume2,
  VolumeX,
  Loader2,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { MockCattleListing } from "@/constants/mockCattle";

const LOAD_TIMEOUT_MS = 10_000;

function ReelCard({
  refCallback,
  listing,
  isActive,
  priority,
}: {
  listing: MockCattleListing;
  isActive: boolean;
  priority?: boolean;
  refCallback?: (el: HTMLDivElement | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevActive = useRef(false);

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
      video.currentTime = 0;
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
  };

  const retry = () => {
    const video = videoRef.current;
    if (!video) return;
    setState("loading");
    video.load();
  };

  return (
    <div
      ref={(el) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (refCallback) refCallback(el);
      }}
      className="relative h-screen w-full snap-start snap-always bg-black overflow-hidden"
    >
      {/* Loading spinner */}
      {state === "loading" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            <p className="text-sm text-white/40">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error state */}
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

      {/* Video */}
      <video
        ref={videoRef}
        src={listing.videoUrl}
        muted={muted}
        loop
        autoPlay
        playsInline
        preload={priority ? "auto" : "metadata"}
        className="absolute inset-0 h-full w-full object-cover"
        onCanPlay={handleLoad}
        onLoadedData={handleLoad}
        onError={handleError}
      />

      {/* Bottom gradient overlay for text readability */}
      <div className="reels-gradient absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-10" />

      {/* Top gradient for controls readability */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Close button - top left */}
      <Link
        href="/"
        className="absolute left-4 top-12 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition active:scale-90 hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Link>

      {/* Mute/Unmute - top right */}
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute right-4 top-12 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition active:scale-90 hover:bg-white/20"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Bottom info + action buttons */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-10">
        <div className="flex items-end justify-between gap-4">
          {/* Left: Text info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              {listing.category}
            </p>
            <h2 className="text-xl font-bold leading-tight text-white drop-shadow-lg">
              {listing.breed}
            </h2>
            <p className="text-2xl font-bold text-brand-300 drop-shadow-lg">
              {formatPrice(listing.price)}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              <span>{listing.location}</span>
              <span className="text-white/30">•</span>
              <span>{listing.sellerName}</span>
            </div>
            {listing.description && (
              <p className="max-w-xs text-xs leading-relaxed text-white/60 line-clamp-2">
                {listing.description}
              </p>
            )}
          </div>

          {/* Right: Action icons vertical column */}
          <div className="flex flex-col items-center gap-5 shrink-0">
            <motion.button
              type="button"
              onClick={() => setLiked((l) => !l)}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex flex-col items-center gap-1"
            >
              <motion.span
                animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md ${
                  liked
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/40"
                    : "bg-white/10 text-white"
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </motion.span>
              <span className="text-[10px] font-medium text-white/60">Like</span>
            </motion.button>

            <motion.a
              href={`tel:+919999999999`}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                <Phone className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-white/60">Call</span>
            </motion.a>

            <motion.a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(`Interested in ${listing.breed} - ${formatPrice(listing.price)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-white/60">WhatsApp</span>
            </motion.a>
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
  const reelsRefs = useRef<(HTMLDivElement | null)[]>(new Array(listings.length).fill(null));

  const setReelRef = useCallback((i: number) => (el: HTMLDivElement | null) => {
    reelsRefs.current[i] = el;
  }, []);

  // IntersectionObserver for 70% threshold autoplay
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLDivElement;
          const idx = reelsRefs.current.indexOf(card);
          if (idx === -1) continue;

          if (entry.isIntersecting) {
            setActiveIndex(idx);
          }
        }
      },
      {
        root: container,
        threshold: 0.7,
      },
    );

    const currentRefs = reelsRefs.current;
    for (const ref of currentRefs) {
      if (ref) observer.observe(ref);
    }

    return () => {
      for (const ref of currentRefs) {
        if (ref) observer.unobserve(ref);
      }
    };
  }, [listings]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide bg-black"
    >
      {listings.map((listing, i) => (
        <ReelCard
          key={listing.id}
          listing={listing}
          isActive={i === activeIndex}
          priority={i < 2}
          refCallback={setReelRef(i)}
        />
      ))}
    </div>
  );
}
