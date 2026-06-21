import { CategoryGrid } from "@/components/category-grid";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { CattleListings } from "@/components/cattle-listings";
import { cattleListings } from "@/constants";

const FILLER_WORDS = new Set([
  "khoj", "do", "dikhao", "dikhaye", "dikha", "ke", "hain", "hai", "ho",
  "ko", "ka", "ki", "mein", "me", "se", "par", "pe", "aur", "tha", "the",
  "ye", "jo", "karo", "kare", "kar", "liye", "wala", "wali", "wale",
  "ek", "kuch", "sab", "bahut", "tha", "thi", "the", "hoga",
]);

const CATEGORY_KEYWORDS: Record<string, string> = {
  gaay: "Cow", gay: "Cow", gai: "Cow", gaye: "Cow", cow: "Cow",
  "\u0917\u093e\u092f": "Cow",
  bhains: "Buffalo", bhais: "Buffalo", buffalo: "Buffalo",
  "\u092d\u0948\u0902\u0938": "Buffalo",
  bakri: "Goat", bakari: "Goat", goat: "Goat",
  "\u092c\u0915\u0930\u0940": "Goat",
  bhed: "Sheep", bhedh: "Sheep", sheep: "Sheep",
  "\u092d\u0947\u0921\u093c": "Sheep",
};

function filterListings(
  listings: typeof cattleListings,
  category?: string,
  query?: string,
) {
  let filtered = listings;
  let effectiveCategory = category;
  let effectiveQuery = query ? query.toLowerCase().trim() : "";

  if (effectiveQuery) {
    const words = effectiveQuery.split(/\s+/).filter(Boolean);
    const cleaned: string[] = [];
    let detectedCategory: string | null = null;

    for (const word of words) {
      if (FILLER_WORDS.has(word)) continue;
      const mapped = CATEGORY_KEYWORDS[word];
      if (mapped) {
        detectedCategory = mapped;
      } else {
        cleaned.push(word);
      }
    }

    if (detectedCategory) {
      effectiveCategory = detectedCategory;
    }

    effectiveQuery = cleaned.join(" ");
  }

  if (effectiveCategory) {
    filtered = filtered.filter(
      (l) => l.category.toLowerCase() === effectiveCategory!.toLowerCase(),
    );
  }

  if (effectiveQuery) {
    const q = effectiveQuery;
    filtered = filtered.filter(
      (l) =>
        l.breed.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.sellerName?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q),
    );
  }

  return { listings: filtered, usedCategory: effectiveCategory, usedQuery: effectiveQuery };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; query?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const query = params.query;

  const { listings: filtered, usedCategory, usedQuery } = filterListings(cattleListings, category, query);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
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
          <CategoryGrid activeCategory={usedCategory || category} />
        </section>

        <CattleListings
          listings={filtered}
          allListings={cattleListings}
          query={query}
          category={category}
          usedCategory={usedCategory}
          usedQuery={usedQuery}
        />
      </div>
    </main>
  );
}
