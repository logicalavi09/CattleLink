"use client";

import { Suspense, useEffect, useRef, useState, useTransition, useCallback } from "react";
import {
  LayoutDashboard, Search, Sprout, X, Languages, Mic, MessageCircle,
  PlusCircle, Menu, User, Home,
} from "lucide-react";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const FILLER_WORDS = new Set([
  "khoj", "do", "dikhao", "dikhaye", "dikha", "ke", "hain", "hai", "ho",
  "ko", "ka", "ki", "mein", "me", "se", "par", "pe", "aur", "tha", "the",
  "ye", "jo", "karo", "kare", "kar", "liye", "wala", "wali", "wale",
  "ek", "kuch", "sab", "bahut",
]);

const VOICE_CATEGORY_MAP: Record<string, string> = {
  gaay: "Cow", gay: "Cow", cow: "Cow", gai: "Cow", gaye: "Cow",
  bhains: "Buffalo", bhais: "Buffalo", buffalo: "Buffalo",
  bakri: "Goat", bakari: "Goat", goat: "Goat",
  bhed: "Sheep", bhedh: "Sheep", sheep: "Sheep",
};

function cleanTranscript(transcript: string): { cleaned: string; category: string | null } {
  const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
  const meaningful: string[] = [];
  let category: string | null = null;

  for (const word of words) {
    if (FILLER_WORDS.has(word)) continue;
    const mapped = VOICE_CATEGORY_MAP[word];
    if (mapped) {
      category = mapped;
    } else {
      meaningful.push(word);
    }
  }

  return { cleaned: meaningful.join(" "), category };
}

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(() => searchParams.get("query") ?? "");
  const [isListening, setIsListening] = useState(false);
  const isFirstRender = useRef(true);
  const { t } = useLanguage();

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
      params.delete("category");
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/?${qs}` : "/");
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, router]);

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : "/");
    });
  };

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error(t("voice.not_supported"));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RecognitionClass = SpeechRecognitionAPI as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new RecognitionClass();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success(t("voice.activated"));
    };

    recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
      const transcript = event.results[0][0].transcript;
      const { cleaned, category } = cleanTranscript(transcript);

      if (category) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", category);
        if (cleaned) params.set("query", cleaned);
        const qs = params.toString();
        startTransition(() => {
          router.replace(qs ? `/?${qs}` : "/");
        });
        toast.success(t(`voice.${category.toLowerCase()}_found`));
      } else if (cleaned) {
        setSearchValue(cleaned);
      } else {
        toast.error(t("voice.speak_now"));
      }
    };

    recognition.onerror = () => {
      toast.error(t("voice.error"));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [router, searchParams, startTransition, t]);

  return (
    <div className="relative flex-1">
      <span className="sr-only">{t("nav.search")}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={t("nav.search")}
        className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-20 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          isPending
            ? "border-brand-300 ring-4 ring-brand-100/50"
            : "border-brand-100 focus:border-brand-400 focus:ring-brand-100"
        }`}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={startVoiceSearch}
          disabled={isListening}
          title={t("voice.tooltip")}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
            isListening
              ? "bg-red-100 text-red-600 animate-pulse"
              : "bg-brand-50 text-brand-600 hover:bg-brand-100"
          }`}
        >
          <Mic className={`h-4 w-4 ${isListening ? "animate-bounce" : ""}`} />
        </button>
      </div>
    </div>
  );
}

function SearchFallback() {
  const { t } = useLanguage();

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        placeholder={t("nav.search")}
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50 active:scale-95"
      title={t(`lang.${lang === "en" ? "hi" : "en"}`)}
    >
      <Languages className="h-4 w-4" />
    </button>
  );
}

export function Navbar() {
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-ink-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">{t("app.name")}</span>
          </Link>

          <div className="hidden sm:flex flex-1 items-center mx-6">
            <Suspense fallback={<SearchFallback />}>
              <SearchInner />
            </Suspense>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/community"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50 active:scale-95 sm:w-auto sm:px-3 sm:gap-2"
              title={t("nav.community")}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-semibold">{t("nav.community")}</span>
            </Link>

            <LangSwitcher />

            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/sell">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">{t("nav.sell")}</span>
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50 active:scale-95 sm:w-auto sm:px-3 sm:gap-2"
                title={t("nav.dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-semibold">{t("nav.dashboard")}</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 active:scale-95"
              >
                <PlusCircle className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{t("nav.sell")}</span>
              </Link>
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
            </Show>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <Show when="signed-in">
              <div className="scale-90">
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm"
                  aria-label="Sign in"
                >
                  <User className="h-4 w-4" />
                </button>
              </SignInButton>
            </Show>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search bar - full width below navbar */}
      <div className="sm:hidden border-b border-brand-100/80 bg-white px-4 py-2">
        <Suspense fallback={<SearchFallback />}>
          <SearchInner />
        </Suspense>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
                <span className="text-lg font-semibold text-ink-900">Menu</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-5">
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50"
                >
                  <Home className="h-5 w-5 text-brand-600" />
                  Home
                </Link>
                <Link
                  href="/community"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50"
                >
                  <MessageCircle className="h-5 w-5 text-brand-600" />
                  {t("nav.community")}
                </Link>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50"
                  >
                    <LayoutDashboard className="h-5 w-5 text-brand-600" />
                    {t("nav.dashboard")}
                  </Link>
                </Show>
                <hr className="my-2 border-brand-100" />
                <div className="flex items-center justify-between rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">Language / भाषा</span>
                  <LangSwitcher />
                </div>
                <hr className="my-2 border-brand-100" />
                <Show when="signed-out">
                  <SignInButton mode="modal" forceRedirectUrl="/sell">
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      <PlusCircle className="h-5 w-5" />
                      {t("nav.sell")}
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/sell"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center gap-3 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    <PlusCircle className="h-5 w-5" />
                    {t("nav.sell")}
                  </Link>
                </Show>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
