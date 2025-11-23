
'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ArrowRight, Trophy } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { AnimatedNumber } from './AnimatedNumber';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

function LeaderboardSkeleton() {
    return (
        <div className="space-y-2">
            <div className="flex items-center p-4">
                <Skeleton className="h-6 w-12" />
                <div className="flex items-center gap-3 ml-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <Skeleton className="h-6 w-12 ml-auto" />
            </div>
             {Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="flex items-center p-4">
                    <Skeleton className="h-6 w-12" />
                    <div className="flex items-center gap-3 ml-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-12 ml-auto" />
                </div>
            ))}
        </div>
    )
}

export function Leaderboard() {
  const firestore = useFirestore();
  const leaderboardQuery = firestore ? query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(10)) : null;
  const { data: leaderboardData, loading } = useCollection<LeaderboardEntry>(leaderboardQuery);

  const getRankContent = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return rank + 1;
  }

  return (
    <div className="w-full max-w-4xl">
        <Card className="w-full bg-black/20 backdrop-blur-lg border-purple-500/30 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-500">
        <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl'>
                <Trophy className="w-6 h-6 text-primary" />
                Hall of Flame
            </CardTitle>
            <CardDescription>The top-roasted legends on GitHub, ranked by Seriousness Score.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                {loading && <LeaderboardSkeleton />}
                {!loading && leaderboardData && (
                    <div className="divide-y divide-purple-500/10">
                        {/* Header */}
                        <div className="flex items-center p-4 font-medium text-muted-foreground">
                            <div className="w-[50px] text-left pl-2">Rank</div>
                            <div className="flex-1">User</div>
                            <div className="text-right">Seriousness Score</div>
                        </div>

                        {leaderboardData.map((entry, index) => (
                            <Collapsible key={entry.id}>
                                <div className="flex flex-col">
                                    <CollapsibleTrigger asChild>
                                      <div className='flex items-center p-4 hover:bg-white/5 cursor-pointer'>
                                        <div className="w-[50px] font-medium text-lg text-center">
                                           {getRankContent(index)}
                                        </div>
                                        <div className='flex-1 flex items-center gap-3'>
                                            <Image
                                            src={entry.avatarUrl}
                                            alt={entry.username}
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-primary/50"
                                            />
                                            <div>
                                                <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">{entry.username}</a>
                                                <p className="text-sm text-muted-foreground">{entry.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right font-bold text-primary text-lg">
                                            <AnimatedNumber value={entry.score} />
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                    {entry.roast && (
                                      <CollapsibleContent>
                                          <div className="bg-background/50 border-t border-b border-purple-500/20 p-4 mx-4 mb-4 rounded-lg">
                                            <p className="text-center italic text-primary/90">"{entry.roast}"</p>
                                          </div>
                                      </CollapsibleContent>
                                    )}
                                </div>
                            </Collapsible>
                        ))}
                    </div>
                )}
                 {!loading && (!leaderboardData || leaderboardData.length === 0) && (
                    <div className="text-center p-8 text-muted-foreground">
                        The Hall of Flame is empty. Be the first to get roasted and claim the top spot!
                    </div>
                 )}
            </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4">
            <Button asChild variant="ghost">
                <Link href="/leaderboard">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>
        </CardFooter>
        </Card>
    </div>
  );
}
