"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function InstallBanner() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) setShow(false);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    const result = await (deferredPrompt as any).userChoice;
    if (result.outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-brand-200 bg-white p-4 shadow-2xl shadow-brand-900/20 backdrop-blur md:left-auto md:right-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100">
        <Download className="h-5 w-5 text-brand-700" />
      </div>
      <div className="flex-1 text-sm min-w-0">
        <p className="font-semibold text-ink-900">{t("install.title")}</p>
        <p className="text-slate-500 truncate">{t("install.subtitle")}</p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="inline-flex h-9 shrink-0 items-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
      >
        {t("install.button")}
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
