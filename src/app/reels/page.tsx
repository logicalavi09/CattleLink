import { ReelsFeed } from "@/components/reels-feed";
import { mockCattleListings } from "@/constants/mockCattle";

export default function ReelsPage() {
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <ReelsFeed listings={mockCattleListings} />
    </div>
  );
}
