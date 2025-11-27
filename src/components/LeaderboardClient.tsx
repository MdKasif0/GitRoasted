'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const Leaderboard = dynamic(() => import('@/components/Leaderboard').then(mod => mod.Leaderboard), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl">
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
});

export function LeaderboardClient() {
    return <Leaderboard />;
}
