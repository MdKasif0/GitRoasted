
import { LeaderboardClient } from './LeaderboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard | Hall of Flame',
  description: 'See the top-roasted developers on the GitRoasted Hall of Flame. Ranked by seriousness score, see who has the most roastable GitHub profile.',
  alternates: {
    canonical: '/leaderboard',
  },
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <LeaderboardClient />
    </div>
  );
}
