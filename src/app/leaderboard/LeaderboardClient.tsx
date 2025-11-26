
'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Crown, RefreshCw, Search, Trophy, Loader2 } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLeaderboard } from '@/context/LeaderboardContext';

type TimeFilter = 'all' | 'month' | 'week';

const PodiumCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: 1 | 2 | 3 }) => {
    const isFirst = rank === 1;
    return (
        <Collapsible>
            <div className={cn(
                'relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 bg-white/5 backdrop-blur-xl',
                isFirst ? 'border-primary/60 shadow-primary/20 shadow-2xl z-10 scale-105' : 'border-white/10 scale-95 mt-6',
            )}>
                <CollapsibleTrigger asChild>
                    <div className='w-full cursor-pointer'>
                        <div className={cn('absolute top-2 left-2 flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-background/50 border-2', isFirst ? 'border-primary' : 'border-white/10')}>{rank}</div>
                        <Crown className={cn(
                            'absolute top-2 right-2 w-6 h-6',
                            isFirst ? 'text-primary' : 'text-white/30'
                        )} />
                        <Image
                            src={entry.avatarUrl}
                            alt={entry.username}
                            width={isFirst ? 80 : 64}
                            height={isFirst ? 80 : 64}
                            className={cn('rounded-full border-4 shadow-lg mb-2 mx-auto',
                                isFirst ? 'border-primary' : 'border-white/20'
                            )}
                        />
                        <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="text-base font-bold hover:text-primary transition-colors truncate w-full">{entry.name}</a>
                        <p className="text-sm text-muted-foreground">@{entry.username}</p>
                        <div className="mt-2 text-lg font-bold text-primary flex items-center justify-center gap-1">
                            <AnimatedNumber value={entry.score} /> / 1000
                        </div>
                    </div>
                </CollapsibleTrigger>
                {entry.roast && (
                  <CollapsibleContent>
                      <div className="bg-background/50 border-t border-purple-500/20 p-3 mt-3 -mb-2 rounded-b-lg">
                        <p className="text-center italic text-primary/90 text-sm">"{entry.roast}"</p>
                      </div>
                  </CollapsibleContent>
                )}
            </div>
        </Collapsible>
    )
}

function LeaderboardSkeleton() {
    return (
        <>
             <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr] gap-2 items-end max-w-lg mx-auto mb-12">
                 <Skeleton className="h-48 w-full rounded-2xl" />
                 <Skeleton className="h-56 w-full rounded-2xl" />
                 <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                     <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        </>
    )
}

const getRankContent = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
}

const getRankBorderClass = (rank: number) => {
    if (rank === 1) return 'border-yellow-400';
    if (rank === 2) return 'border-slate-400';
    if (rank === 3) return 'border-orange-400';
    return 'border-white/10';
}

export function LeaderboardClient() {
  const { leaderboard, loading, lastUpdated, refreshLeaderboard, filterLeaderboard, loadMore, hasMore, totalUsers } = useLeaderboard();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefresh = () => {
    refreshLeaderboard(timeFilter, true);
  }

  useEffect(() => {
    refreshLeaderboard(timeFilter);
  }, [timeFilter, refreshLeaderboard]);

  const filteredData = useMemo(() => {
      return filterLeaderboard(timeFilter, searchTerm);
  }, [leaderboard, timeFilter, searchTerm, filterLeaderboard]);


  const podiumData = filteredData.slice(0, 3);
  
  const podiumDisplayOrder = useMemo(() => {
      if (podiumData.length === 0) return [];
      const sortedPodium = [...podiumData].sort((a,b) => b.score - a.score);
      if (sortedPodium.length < 3) return sortedPodium;
      // Ensure the display order is always [2nd, 1st, 3rd] for the tiered layout
      const display = [sortedPodium[1], sortedPodium[0], sortedPodium[2]].filter(Boolean);
      return display;
  }, [podiumData]);


  return (
    <div className="w-full max-w-5xl mx-auto">
        <header className="relative text-center mb-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="w-10 h-10 text-primary" />
                    Leaderboard
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                    The Hall of Flame: See the top-roasted legends and where you stand.
                </p>
            </div>
        </header>

        <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                    placeholder="Search username..."
                    className="pl-10 h-12 bg-white/5 border-purple-500/30 rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-3 gap-2">
                {(['all', 'month', 'week'] as TimeFilter[]).map(filter => (
                    <Button 
                        key={filter} 
                        variant='ghost'
                        onClick={() => setTimeFilter(filter)}
                        className={cn(
                            'capitalize h-12 rounded-full text-base transition-all duration-300 border-2 border-transparent', 
                            timeFilter === filter 
                                ? 'bg-gradient-to-r from-primary via-red-400 to-purple-500 text-white font-bold border-primary/50' 
                                : 'bg-white/5 text-muted-foreground'
                        )}
                    >
                        {filter === 'all' ? 'All Time' : `This ${filter}`}
                    </Button>
                ))}
            </div>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-8 text-sm">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="bg-white/5 border-white/10">
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
            </Button>
            {lastUpdated && (
                <p className="text-muted-foreground">
                    Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </p>
            )}
        </div>


        {loading && leaderboard.length === 0 && <LeaderboardSkeleton />}

        {!loading || leaderboard.length > 0 ? (
            <>
                {/* Desktop Podium */}
                {podiumData.length > 0 && (
                     <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr] gap-2 items-end max-w-lg mx-auto mb-12">
                        {podiumDisplayOrder.map((entry) => {
                            if (!entry) return null;
                            const sortedPodium = [...podiumData].sort((a,b) => b.score - a.score);
                            const rank = (sortedPodium.findIndex(p => p.username === entry.username) + 1) as 1 | 2 | 3;
                           
                            return <PodiumCard key={entry.username} entry={entry} rank={rank} />
                        })}
                    </div>
                )}
                
                {/* Unified List for Mobile, and rest of list for Desktop */}
                <div className="space-y-2">
                    {filteredData.map((entry, index) => {
                        const rank = index + 1;
                        const isPodium = rank <= 3;
                        return (
                            <Collapsible key={entry.username} className={cn(isPodium && 'md:hidden')}>
                                <div className={cn("bg-white/5 backdrop-blur-xl rounded-xl border-2", getRankBorderClass(rank))}>
                                    <CollapsibleTrigger className="flex items-center p-3 text-lg w-full">
                                        <div className="w-12 font-bold text-muted-foreground text-center">{getRankContent(rank)}</div>
                                        <div className="flex items-center gap-4 flex-1 overflow-hidden text-left">
                                            <Image
                                                src={entry.avatarUrl}
                                                alt={entry.username}
                                                width={48}
                                                height={48}
                                                className="rounded-full border-2 border-primary/50 shrink-0"
                                            />
                                            <div className="truncate">
                                                 <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors truncate text-base">{entry.name}</a>
                                                 <p className="text-sm text-muted-foreground truncate">@{entry.username}</p>
                                            </div>
                                        </div>
                                         <div className="text-lg font-bold text-primary flex items-center gap-2 shrink-0">
                                            <AnimatedNumber value={entry.score} />
                                        </div>
                                    </CollapsibleTrigger>
                                    {entry.roast && (
                                        <CollapsibleContent>
                                            <div className="border-t border-purple-500/20 p-4 mx-4 mb-4 rounded-b-lg">
                                                <p className="text-center italic text-primary/90">"{entry.roast}"</p>
                                            </div>
                                        </CollapsibleContent>
                                    )}
                                </div>
                            </Collapsible>
                        )
                    })}
                </div>

                {!loading && filteredData.length === 0 && (
                     <div className="text-center p-16 text-muted-foreground bg-white/5 rounded-lg">
                        <p className="text-xl mb-2">No legends found!</p>
                        <p>
                            {searchTerm 
                                ? 'No users match your search.'
                                : 'The Hall of Flame is empty for this time period. Be the first to get roasted!'
                            }
                        </p>
                    </div>
                )}
                
                 <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4">
                     {hasMore && (
                        <Button 
                            onClick={() => loadMore(timeFilter)} 
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                        >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                              </>
                            ) : (
                                'Load More'
                            )}
                        </Button>
                     )}
                </div>
                 <div className="text-center text-muted-foreground mt-4">
                    {totalUsers > 0 && <p>Showing {filteredData.length} of {totalUsers} users.</p>}
                </div>
                 {!hasMore && filteredData.length > 0 && (
                    <div className="text-center text-muted-foreground mt-4">
                        🎉 You've reached the end!
                    </div>
                 )}
            </>
        ) : (
             <div className="text-center p-16 text-muted-foreground bg-white/5 rounded-lg">
                <p className="text-xl mb-2">Loading Leaderboard...</p>
            </div>
        )}
    </div>
  );
}
