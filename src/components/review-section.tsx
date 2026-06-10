"use client";

import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Review } from "@/models/cattle";

interface Props {
  reviews?: Review[];
  sellerRating?: number;
}

export function ReviewSection({ reviews = [], sellerRating }: Props) {
  const [expanded, setExpanded] = useState(false);

  const avgRating =
    sellerRating ||
    (reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0);

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900">Seller Reviews</h2>
        {avgRating > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-semibold text-ink-900">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, expanded ? undefined : 2).map((review) => (
            <div
              key={review.id}
              className="border-b border-brand-100 pb-4 last:border-b-0"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">
                  {review.author}
                </p>
                <span className="text-xs text-slate-400">{review.date}</span>
              </div>
              <div className="mb-1 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      {reviews.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-700"
        >
          {expanded ? "Show less" : `Show all ${reviews.length} reviews`}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
