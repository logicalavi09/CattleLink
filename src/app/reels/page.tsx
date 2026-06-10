import { ReelsFeed } from "@/components/reels-feed";
import { mockCattleListings } from "@/constants/mockCattle";

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ReelsPage() {
  const shuffled = fisherYatesShuffle(mockCattleListings);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <ReelsFeed listings={shuffled} />
    </div>
  );
}
