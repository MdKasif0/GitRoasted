import { LeaderboardClient } from './LeaderboardClient';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeaderboardProvider } from '@/context/LeaderboardContext';

export const metadata: Metadata = {
  title: 'Leaderboard | Hall of Flame',
  description:
    'See the top-roasted developers on the GitRoasted Hall of Flame. Ranked by seriousness score, see who has the most roastable GitHub profile.',
  alternates: {
    canonical: '/leaderboard',
  },
};

export default function LeaderboardPage() {
  return (
    <LeaderboardProvider>
      <div className="min-h-screen bg-[#080706] text-[#F5F5F4] selection:bg-[#FF8A00]/25 selection:text-[#FF8A00] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className="w-full max-w-[1140px] flex flex-col">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between w-full mb-8">
            <Link
              href="/"
              aria-label="Back to Home"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#11100F] border border-[#292623] hover:border-neutral-600 hover:bg-[#171513] text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-neutral-500">
              <span>ROAST</span>
              <span>&gt;</span>
              <span>ANALYZE</span>
              <span>&gt;</span>
              <span>IMPROVE</span>
            </div>
          </div>

          {/* Main Leaderboard Client */}
          <LeaderboardClient />
        </div>
      </div>
    </LeaderboardProvider>
  );
}
