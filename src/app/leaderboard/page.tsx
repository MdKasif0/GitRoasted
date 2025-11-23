import { LeaderboardClient } from './LeaderboardClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Leaderboard',
  description: 'See the top-roasted developers on the GitRoasted Hall of Flame.',
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
       <div className="absolute top-4 left-4">
            <Button asChild variant="ghost">
                <Link href="/">
                    &larr; Back to Home
                </Link>
            </Button>
        </div>
      <LeaderboardClient />
    </div>
  );
}
