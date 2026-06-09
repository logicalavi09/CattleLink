import { CategoryGrid } from "@/components/category-grid";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { CattleListings } from "@/components/cattle-listings";
import { cattleListings } from "@/constants";

function filterListings(
  listings: typeof cattleListings,
  category?: string,
  query?: string,
) {
  let filtered = listings;

  if (category) {
    filtered = filtered.filter(
      (l) => l.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.breed.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.sellerName?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q),
    );
  }

  return filtered;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; query?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const query = params.query;

  const filtered = filterListings(cattleListings, category, query);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-16 pt-3 sm:px-6 lg:px-8">
      <Navbar />
      <div className="space-y-14 pb-6 pt-6 sm:space-y-16 lg:pt-8">
        {!category && !query && <HeroSection />}

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
          <CategoryGrid activeCategory={category} />
        </section>

        <CattleListings
          listings={filtered}
          query={query}
          category={category}
        />
      </div>
    </main>
  );
}
