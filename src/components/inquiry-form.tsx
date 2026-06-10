"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  listingId: string;
  sellerName?: string;
}

export function InquiryForm({ listingId, sellerName }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, name, phone, message }),
      });
      if (!res.ok) throw new Error();
      toast.success("Inquiry sent! Seller will contact you soon.");
      setName("");
      setPhone("");
      setMessage("");
      setOpen(false);
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700"
        >
          <MessageCircle className="h-5 w-5" />
          Contact {sellerName || "Seller"}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-green-200 bg-green-50 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-800">
              Send Inquiry
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-green-600"
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
            placeholder="Message (optional)"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
