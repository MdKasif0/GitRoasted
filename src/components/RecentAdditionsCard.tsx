
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeaderboard } from '@/context/LeaderboardContext';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { FlameIcon } from './icons';

export function RecentAdditionsCard() {
  const { leaderboard, loading } = useLeaderboard();

  // Sort by roastedAt date to get the most recent
  const recentAdditions = [...leaderboard]
    .sort((a, b) => new Date(b.roastedAt).getTime() - new Date(a.roastedAt).getTime())
    .slice(0, 7);

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle>Recent Additions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))}
          </div>
        )}
        {!loading && (
           <ul className="space-y-4">
            {recentAdditions.map((entry) => (
              <li key={entry.username} className="flex items-center gap-3">
                <Image
                  src={entry.avatarUrl}
                  alt={entry.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">@{entry.username}</p>
                </div>
                <div className="text-right text-sm font-bold text-primary flex items-center gap-1">
                  <FlameIcon className='w-4 h-4' />
                  <span>{Math.round(entry.score / 10)}/100</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
