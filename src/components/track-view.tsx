"use client";

import { useEffect } from "react";

export function TrackView({ listingId }: { listingId: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: listingId }),
    }).catch(() => {});
  }, [listingId]);

  return null;
}
