import { CategoryGrid } from "@/components/category-grid";
import { CattleCard } from "@/components/cattle-card";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { cattleListings } from "@/constants";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-16 pt-3 sm:px-6 lg:px-8">
      <Navbar />
      <div className="space-y-14 pb-6 pt-6 sm:space-y-16 lg:pt-8">
        <HeroSection />

        <section id="categories" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
                Browse by type
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                Popular cattle categories
              </h2>
            </div>
          </div>
          <CategoryGrid />
        </section>

        <section id="featured-listings" className="space-y-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-earth-600">
              Featured listings
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Recent cattle ready to explore
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
              These sample cards help shape the first marketplace experience. Replace them with live seller listings once the data layer is ready.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cattleListings.map((listing) => (
              <CattleCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}