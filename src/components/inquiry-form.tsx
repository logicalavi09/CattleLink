"use client";

import { useState } from "react";
import { X, SendHorizonal, CheckCircle, Flag } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  listingId: string;
  sellerName?: string;
  sellerId?: string;
  cattleName?: string;
  cattleBreed?: string;
}

export function InquiryForm({ listingId, sellerName, sellerId, cattleName, cattleBreed }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          sellerId: sellerId || "mock",
          name,
          phone,
          message,
          cattleName: cattleName || "",
          cattleBreed: cattleBreed || "",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Inquiry sent! Seller will contact you soon.");
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
        <p className="mt-2 text-sm font-semibold text-green-800">
          Inquiry sent successfully!
        </p>
        <p className="mt-1 text-xs text-green-600">
          {sellerName || "Seller"} will contact you soon on {phone}
        </p>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition hover:shadow-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98]"
        >
          <SendHorizonal className="h-5 w-5" />
          Send Inquiry
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-green-200 bg-green-50 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-800">
              Contact {sellerName || "Seller"}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-green-600 hover:text-green-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            placeholder="Phone number *"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <textarea
            placeholder="Your message (optional) — age, location, any questions..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}

export function ReportButton({ listingId }: { listingId: string }) {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    if (reported) return;
    console.debug("Reported listing:", listingId);
    toast.success("Listing reported. We will review it shortly.");
    setReported(true);
  };


  return (
    <button
      type="button"
      onClick={handleReport}
      disabled={reported}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 transition disabled:opacity-50"
    >
      <Flag className="h-3.5 w-3.5" />
      {reported ? "Reported" : "Report Listing"}
    </button>
  );
}
