"use client";

import { useActionState, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Sprout, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createCattleListing, getCattleListing } from "@/app/actions/cattle";

const CATTLE_TYPES = ["Cow", "Buffalo", "Goat", "Sheep", "Other"] as const;

function SellForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [initialData, setInitialData] = useState<{
    name: string; type: string; breed: string;
    price: string; location: string; description: string; videoUrl: string;
  } | null>(null);
  const [loadingData, setLoadingData] = useState(!!editId);

  useEffect(() => {
    if (!editId) return;
    getCattleListing(editId).then((data) => {
      if (data) {
        setInitialData({
          name: data.name || "",
          type: data.type || "",
          breed: data.breed || "",
          price: String(data.price || ""),
          location: data.location || "",
          description: data.description || "",
          videoUrl: data.videoUrl || "",
        });
        if (data.videoUrl) setVideoUrl(data.videoUrl);
      }
      setLoadingData(false);
    });
  }, [editId]);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      if (videoUrl) formData.set("videoUrl", videoUrl);
      if (editId) formData.set("id", editId);
      return await createCattleListing(formData);
    },
    null,
  );

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
          {editId ? "Edit listing" : "List your cattle"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {editId
            ? "Update the details of your cattle listing."
            : "Fill in the details and upload a short video to showcase your cattle."}
        </p>
      </div>

      {state?.success ? (
        <div className="rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
            <CheckCircle className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink-900">
            {editId ? "Listing updated!" : "Listing published!"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Redirecting to dashboard...</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-ink-900">Basic details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-900">
                  Cattle name / title <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialData?.name ?? ""}
                  placeholder="e.g. Gir Cow, Murrah Buffalo"
                  className="h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-ink-900">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    defaultValue={initialData?.type ?? ""}
                    className="h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  >
                    <option value="">Select type</option>
                    {CATTLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="breed" className="mb-1.5 block text-sm font-medium text-ink-900">
                    Breed <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="breed"
                    name="breed"
                    required
                    defaultValue={initialData?.breed ?? ""}
                    placeholder="e.g. Gir, Murrah"
                    className="h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-ink-900">
                    Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="1"
                    defaultValue={initialData?.price ?? ""}
                    placeholder="e.g. 55000"
                    className="h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-ink-900">
                    Location (City/State) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    required
                    defaultValue={initialData?.location ?? ""}
                    placeholder="e.g. Haryana, Punjab"
                    className="h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-900">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={initialData?.description ?? ""}
                  placeholder="Age, health, milk yield, vaccination status, etc."
                  className="w-full resize-none rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-ink-900">Video listing</h2>
            <p className="mb-4 text-sm text-slate-500">
              Upload a short video showing the animal&apos;s health, movement, and overall condition.
            </p>

            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                sources: ["local"],
                clientAllowedFormats: ["mp4", "mov", "avi", "webm"],
                maxFiles: 1,
              }}
              onSuccess={(results: CloudinaryUploadWidgetResults) => {
                const info = results?.info as Record<string, unknown> | undefined;
                if (info?.secure_url && typeof info.secure_url === "string") {
                  setVideoUrl(info.secure_url);
                }
                setVideoUploading(false);
              }}
              onOpen={() => setVideoUploading(true)}
              onError={() => setVideoUploading(false)}
            >
              {({ open, isLoading }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={isLoading || videoUploading}
                  className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-sm font-semibold shadow-sm transition ${
                    videoUrl
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-slate-300 bg-white text-slate-500 hover:border-brand-400 hover:text-brand-600"
                  }`}
                >
                  {isLoading || videoUploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : videoUrl ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-brand-600" />
                      Video uploaded successfully
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Upload a short video (MP4, MOV)
                    </>
                  )}
                </button>
              )}
            </CldUploadWidget>

            {videoUrl && (
              <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-2 text-xs text-brand-700">
                <CheckCircle className="-mt-0.5 mr-1 inline h-3 w-3" />
                Ready to publish with your listing
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold text-white shadow-lg transition ${
              isPending
                ? "cursor-not-allowed bg-brand-400"
                : "bg-brand-600 shadow-brand-600/25 hover:bg-brand-700"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {editId ? "Updating..." : "Publishing..."}
              </>
            ) : (
              editId ? "Update listing" : "Publish listing"
            )}
          </button>
        </form>
      )}
    </main>
  );
}

export default function SellPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-earth-50">
      <header className="sticky top-0 z-40 border-b border-brand-100/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-semibold text-ink-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">PashuMarket</span>
          </button>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        }
      >
        <SellForm />
      </Suspense>
    </div>
  );
}
