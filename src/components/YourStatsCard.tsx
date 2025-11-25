
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlameIcon } from './icons';
import Image from 'next/image';
import { AnimatedNumber } from './AnimatedNumber';
import { Star, GitBranch } from 'lucide-react';

// This is a placeholder component.
// In a real app, you would fetch the current user's data.
export function YourStatsCard() {
  const user = {
    name: 'You (Chris P.)',
    username: 'chrisp_roasts',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4', // Using a placeholder avatar
    score: 89,
    stars: 1200,
    followers: 8500,
    rank: 6
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary"
          />
          <div>
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <div className="ml-auto text-center">
            <p className="text-xs text-muted-foreground">Rank</p>
            <p className="text-2xl font-bold text-primary">#{user.rank}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1">{user.score}/100</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Stars</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1"><Star className='w-4 h-4' /> {(user.stars / 1000).toFixed(1)}k</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Followers</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1"><GitBranch className='w-4 h-4' /> {(user.followers / 1000).toFixed(1)}k</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
