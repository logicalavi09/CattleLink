import Link from "next/link";
import { ArrowRight, BadgeCheck, PlayCircle, ShieldCheck } from "lucide-react";

import { trustHighlights } from "@/constants";

export function HeroSection() {
  return (
    <section id="top" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <div className="flex flex-col justify-center gap-6 rounded-[2rem] border border-brand-100 bg-white/85 p-6 shadow-[0_18px_60px_rgba(50,88,34,0.08)] sm:p-8 lg:p-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
          <BadgeCheck className="h-4 w-4" />
          Trusted rural marketplace
        </div>

        <div className="space-y-4">
          <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            Bharat ka Sabse Trusted Pashu Mandi
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            Buy and sell cattle through short videos, verified details, and simple local-language discovery built for farmers on mobile.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#featured-listings"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 sm:w-auto"
          >
            Explore cattle
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="/reels"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-earth-200 bg-earth-50 px-5 text-sm font-semibold text-earth-600 transition hover:border-earth-300 hover:bg-earth-100 sm:w-auto"
          >
            Watch reel-style listings
            <PlayCircle className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trustHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm font-medium text-slate-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-700 via-brand-600 to-earth-500 p-6 text-white shadow-[0_18px_60px_rgba(43,95,36,0.18)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,244,210,0.18),transparent_28%)]" />
        <div className="relative flex h-full flex-col justify-between gap-6">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
              Video-first discovery
            </p>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              Sellers can show health, gait, and temperament before a visit.
            </h2>
            <p className="max-w-md text-sm leading-6 text-white/85 sm:text-base">
              This hero block sets up a reel-inspired marketplace where short clips build trust before a farm visit or phone call.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Avg. response time</p>
              <p className="mt-1 text-2xl font-semibold">Under 2 mins</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Trusted by</p>
              <p className="mt-1 text-2xl font-semibold">Local farmers</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Verified profile preview</p>
                <p className="text-sm leading-6 text-white/85">
                  Built to show the cattle, the seller, and the farm story in one glance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// 