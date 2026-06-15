"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Phone, Clock, User, Loader2, Inbox } from "lucide-react";
import type { InquiryItem } from "@/lib/inquiry-store";

interface Props {
  sellerId: string;
}

export function InquiryHistory({ sellerId }: Props) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inquiries?sellerId=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data.inquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-100 bg-white px-6 py-12 text-center shadow-sm">
        <Inbox className="h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm text-slate-500">No inquiries yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Jab koi buyer inquiry bhejega, yahan dikhega
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Total {inquiries.length} inquiries</p>
      {inquiries.map((inq) => (
        <div
          key={inq.id}
          className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-brand-600" />
                <span className="text-sm font-semibold text-ink-900">{inq.buyerName}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {inq.buyerPhone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(inq.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              {inq.message && (
                <p className="mt-2 text-sm text-slate-700 bg-slate-50 rounded-xl px-3 py-2">
                  {inq.message}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <MessageCircle className="h-3 w-3" />
                <span>
                  {inq.cattleBreed || "Cattle"} {inq.cattleName ? `- ${inq.cattleName}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InquiryBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
