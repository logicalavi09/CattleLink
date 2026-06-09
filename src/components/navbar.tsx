"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { LayoutDashboard, Menu, Search, Sprout, X, Languages } from "lucide-react";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

function SearchInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(() => searchParams.get("query") ?? "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    setSearchValue(searchParams.get("query") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = searchValue.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("query", trimmed);
      } else {
        params.delete("query");
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/?${qs}` : "/");
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : "/");
    });
  };

  const { t } = useLanguage();

  return (
    <div className="relative flex-1">
      <span className="sr-only">{t("nav.search")}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={t("nav.search")}
        className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          isPending
            ? "border-brand-300 ring-4 ring-brand-100/50"
            : "border-brand-100 focus:border-brand-400 focus:ring-brand-100"
        }`}
      />
      {searchValue && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        placeholder="Search cattle, breed, or location"
        className="h-12 w-full rounded-2xl border border-brand-100 bg-white pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400"
        disabled
      />
    </div>
  );
}

function LangSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50"
      title={t(`lang.${lang === "en" ? "hi" : "en"}`)}
    >
      <Languages className="h-4 w-4" />
    </button>
  );
}

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-brand-100/80 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">{t("app.name")}</span>
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
          <Suspense fallback={<SearchFallback />}>
            <SearchInner />
          </Suspense>

          <div className="flex items-center gap-3 lg:justify-end">
            <LangSwitcher />

            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/sell">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 cursor-pointer"
                >
                  {t("nav.sell")}
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-white px-4 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.dashboard")}</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
              >
                {t("nav.sell")}
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
