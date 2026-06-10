import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ShieldCheck as ShieldCheckIcon,
  Calendar,
  Droplets,
  Syringe,
  Sprout,
  Eye,
  Heart,
  Share2,
} from "lucide-react";

import { cattleListings } from "@/constants";
import { formatPrice } from "@/lib/format";
import { TrackView } from "@/components/track-view";
import { ReviewSection } from "@/components/review-section";
import { InquiryForm } from "@/components/inquiry-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = cattleListings.find((l) => l.id === id);
  if (!listing) return {};

  const title = `${listing.breed} - ${formatPrice(listing.price)} | PashuMarket`;
  const description = `${listing.breed} available at ${listing.location}. ${listing.description?.slice(0, 120) || ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/cattle/${id}`,
    },
  };
}

export default async function CattleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = cattleListings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  const isVerifiedSeller = listing.sellerRating ? listing.sellerRating > 4.5 : false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pashumarket.com";
  const shareText = encodeURIComponent(
    `Check out this ${listing.breed} for ${formatPrice(listing.price)} at ${listing.location} on PashuMarket!`,
  );
  const shareUrl = encodeURIComponent(`${siteUrl}/cattle/${listing.id}`);
  const whatsappShare = `https://wa.me/?text=${shareText}%20${shareUrl}`;
  const whatsappInquiry = encodeURIComponent(
    `Hello, I am interested in your ${listing.title || listing.breed} listed on PashuMarket for ${formatPrice(listing.price)}.`,
  );

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <TrackView listingId={id} />
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-sm">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-earth-500 sm:aspect-[21/9]">
          {listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={listing.breed}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 80vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,243,219,0.2),transparent_28%)]" />
          )}
          <div className="absolute inset-x-6 top-6 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Sprout className="h-3.5 w-3.5" />
              {listing.mediaLabel}
            </span>
            {listing.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Featured
              </span>
            )}
          </div>
          {!listing.thumbnailUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur sm:h-32 sm:w-32">
                <PlayCircleIcon className="h-12 w-12 sm:h-14 sm:w-14" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
                  {listing.category}
                </p>
                {isVerifiedSeller && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <ShieldCheckIcon className="h-3 w-3" />
                    Verified Seller
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                {listing.title || listing.breed}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-earth-500" />
                {listing.location}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-3xl font-bold text-brand-700 sm:text-4xl">
                {formatPrice(listing.price)}
              </p>
            </div>
          </div>

          {/* Analytics row */}
          {(listing.views !== undefined || listing.interestCount !== undefined) && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {listing.views !== undefined && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {listing.views} views
                </span>
              )}
              {listing.interestCount !== undefined && (
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  {listing.interestCount} interested
                </span>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {listing.age && (
              <div className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Age</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">{listing.age}</p>
                </div>
              </div>
            )}
            {listing.milkYield && (
              <div className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Droplets className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Milk yield</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">{listing.milkYield}</p>
                </div>
              </div>
            )}
            {listing.vaccinationStatus && (
              <div className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Syringe className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Vaccination
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">
                    {listing.vaccinationStatus}
                  </p>
                </div>
              </div>
            )}
          </div>

          {listing.description && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-ink-900">About this animal</h2>
              <p className="max-w-2xl leading-7 text-slate-700">{listing.description}</p>
            </div>
          )}

          <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">
                {listing.sellerName?.charAt(0) || "S"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink-900">{listing.sellerName || "Seller"}</p>
                  {isVerifiedSeller && (
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{listing.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:+919999999999`}
                className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-brand-600 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href={`https://wa.me/919999999999?text=${whatsappInquiry}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-green-600 bg-green-50 text-base font-semibold text-green-700 transition hover:bg-green-100"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Inquiry
              </a>
            </div>

            {/* Share button */}
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />
              Share on WhatsApp
            </a>
          </div>

          <div className="mt-6">
            <InquiryForm listingId={listing.id} sellerName={listing.sellerName} />
          </div>

          <div className="mt-6">
            <ReviewSection
              reviews={listing.reviews}
              sellerRating={listing.sellerRating}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function PlayCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
