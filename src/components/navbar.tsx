"use client";

import { Menu, Search, Sprout } from "lucide-react";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-brand-100/80 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">PashuMarket</span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-700 shadow-sm lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search cattle listings</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search cattle, breed, or location"
              className="h-12 w-full rounded-2xl border border-brand-100 bg-white pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
          </label>

          <div className="flex items-center gap-3 lg:justify-end">
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/sell">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 cursor-pointer"
                >
                  Sell Cattle
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/sell"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Sell Cattle
              </Link>
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
