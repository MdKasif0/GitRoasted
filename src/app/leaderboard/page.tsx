
import { LeaderboardClient } from './LeaderboardClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
       <div className="absolute top-6 left-6 z-20">
            <Button asChild variant="ghost" size="icon" className="bg-white/5 backdrop-blur-sm border border-white/10 h-10 w-10">
                <Link href="/" aria-label="Back to Home">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
        </div>
      <LeaderboardClient />
    </div>
  );
}
