"use client";

import { useState, useEffect } from "react";
import { List, Inbox, Eye } from "lucide-react";
import { DashboardCard } from "./dashboard-card";
import { InquiryHistory, InquiryBadge } from "@/components/inquiry-history";
import type { DashboardCattleItem } from "./page";

interface Props {
  sellerId: string;
  items: DashboardCattleItem[];
}

export function DashboardInquirySection({ sellerId, items }: Props) {
  const [tab, setTab] = useState<"listings" | "inquiries">("listings");
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    fetch(`/api/inquiries?sellerId=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        setInquiryCount(data.inquiries?.length || 0);
      })
      .catch(() => {});
  }, [sellerId]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-4 border-b border-brand-100">
        <button
          type="button"
          onClick={() => setTab("listings")}
          className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 pt-2 text-sm font-semibold transition ${
            tab === "listings"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-brand-600"
          }`}
        >
          <List className="h-4 w-4" />
          My Listings
          <span className="inline-flex h-5 items-center rounded-full bg-brand-100 px-2 text-xs text-brand-700">
            {items.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab("inquiries")}
          className={`relative inline-flex items-center gap-2 border-b-2 px-1 pb-3 pt-2 text-sm font-semibold transition ${
            tab === "inquiries"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-brand-600"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Inquiry History
          <InquiryBadge count={inquiryCount} />
        </button>
      </div>

      {tab === "listings" ? (
        items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <Eye className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink-900">
              No listings yet
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create your first cattle listing to start selling on PashuMarket.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <DashboardCard key={item._id} item={item} />
            ))}
          </div>
        )
      ) : (
        <InquiryHistory sellerId={sellerId} />
      )}
    </div>
  );
}
