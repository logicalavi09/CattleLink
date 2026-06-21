"use client";

import { PlusCircle } from "lucide-react";
import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function FAB() {
  return (
    <div className="fixed bottom-6 right-6 z-40 sm:hidden">
      <Show when="signed-in">
        <Link
          href="/sell"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700 active:scale-90"
          aria-label="Sell cattle"
        >
          <PlusCircle className="h-6 w-6" />
        </Link>
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal" forceRedirectUrl="/sell">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700 active:scale-90"
            aria-label="Sell cattle"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </SignInButton>
      </Show>
    </div>
  );
}
