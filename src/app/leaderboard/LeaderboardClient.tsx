
// src/app/leaderboard/LeaderboardClient.tsx
'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Crown, RefreshCw, Search, Trophy } from 'lucide-react';
import { collection, query, orderBy, limit, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { startOfMonth, startOfWeek, formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FlameIcon } from '@/components/icons';
import Link from 'next/link';

type TimeFilter = 'all' | 'month' | 'week';

const CACHE_KEY = 'gitroasted_leaderboard';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const PodiumCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: 1 | 2 | 3 }) => {
    const isFirst = rank === 1;
    return (
        <Collapsible className={cn(
            'relative flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300',
            isFirst ? 'border-primary/60 shadow-primary/20 shadow-2xl z-10' : 'border-white/10',
             'md:col-span-1',
            rank === 1 && 'md:row-start-1 md:row-end-3',
            rank === 2 && 'md:row-start-2',
            rank === 3 && 'md:row-start-2'
        )}>
            <CollapsibleTrigger className="w-full">
                <div className={cn('absolute top-0 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-2xl font-bold rounded-full bg-background border-2', isFirst ? 'border-primary' : 'border-white/10')}>{rank}</div>
                <Crown className={cn(
                    'absolute top-4 right-4 w-7 h-7',
                    isFirst ? 'text-primary' : 'text-white/30'
                )} />
                <Image
                    src={entry.avatarUrl}
                    alt={entry.username}
                    width={isFirst ? 96 : 80}
                    height={isFirst ? 96 : 80}
                    className={cn('rounded-full border-4 shadow-lg mb-4 mx-auto',
                        isFirst ? 'border-primary' : 'border-white/20'
                    )}
                />
                <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="text-xl font-bold hover:text-primary transition-colors">{entry.name}</a>
                <p className="text-muted-foreground">@{entry.username}</p>
                <div className="mt-4 text-2xl font-bold text-primary flex items-center justify-center gap-1">
                    <FlameIcon className="w-5 h-5" />
                    <AnimatedNumber value={entry.score} /> / 1000
                </div>
            </CollapsibleTrigger>
            {entry.roast && (
                 <CollapsibleContent>
                    <div className="bg-background/50 border-t border-b border-purple-500/20 p-4 mx-4 mt-4 rounded-lg">
                        <p className="text-sm text-primary/90 italic text-center">"{entry.roast}"</p>
                    </div>
                </CollapsibleContent>
            )}
        </Collapsible>
    )
}

function LeaderboardSkeleton() {
    return (
        <>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto mb-16">
                 <Skeleton className="h-64 w-full rounded-2xl" />
                 <Skeleton className="h-72 w-full rounded-2xl" />
                 <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                     <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        </>
    )
}

export function LeaderboardClient() {
  const firestore = useFirestore();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLeaderboard = useCallback(async (forceRefresh = false) => {
    setLoading(true);

    if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setLeaderboardData(data);
                setLastUpdated(new Date(timestamp));
                setLoading(false);
                return;
            }
        }
    }

    if (!firestore) return;

    let q = query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LeaderboardEntry[];
    
    const now = new Date();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now.getTime() }));
    setLeaderboardData(data);
    setLastUpdated(now);
    setLoading(false);
  }, [firestore]);

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);


  const filteredData = useMemo(() => {
      let data = leaderboardData;

      if (timeFilter === 'month') {
          data = data.filter(entry => entry.roastedAt && entry.roastedAt.toDate() >= startOfMonth(new Date()));
      } else if (timeFilter === 'week') {
          data = data.filter(entry => entry.roastedAt && entry.roastedAt.toDate() >= startOfWeek(new Date()));
      }
      
      if (!searchTerm) return data;

      return data.filter(entry => 
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [leaderboardData, searchTerm, timeFilter])


  const podiumData = filteredData.slice(0, 3);
  const listData = filteredData.slice(3);
  
  const podiumDisplayOrder = useMemo(() => {
      if (podiumData.length === 0) return [];
      const sortedPodium = [...podiumData].sort((a,b) => b.score - a.score);
      if (sortedPodium.length < 3) return sortedPodium;
      return [sortedPodium[1], sortedPodium[0], sortedPodium[2]];
  }, [podiumData]);


  return (
    <div className="w-full max-w-5xl mx-auto">
        <header className="relative text-center mb-12 grid grid-cols-[1fr,auto,1fr] items-center">
             <div className="justify-self-start">
                <Button asChild variant="ghost" size="icon" className="bg-white/5 backdrop-blur-sm border border-white/10 h-10 w-10">
                    <Link href="/" aria-label="Back to Home">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500 mb-2 flex items-center justify-center gap-4">
                    <Trophy className="w-12 h-12 text-primary" />
                    Leaderboard
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    The Hall of Flame: See the top-roasted legends and where you stand.
                </p>
            </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    placeholder="Search username..."
                    className="pl-10 h-12 bg-white/5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
                {(['all', 'month', 'week'] as TimeFilter[]).map(filter => (
                    <Button 
                        key={filter} 
                        variant={timeFilter === filter ? 'default' : 'ghost'}
                        onClick={() => setTimeFilter(filter)}
                        className={cn('capitalize h-full transition-colors', timeFilter === filter && 'bg-primary/80 hover:bg-primary')}
                    >
                        {filter === 'all' ? 'All Time' : `This ${filter}`}
                    </Button>
                ))}
            </div>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-8 text-sm">
            <Button variant="outline" size="sm" onClick={() => getLeaderboard(true)} disabled={loading}>
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
            </Button>
            {lastUpdated && (
                <p className="text-muted-foreground">
                    Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </p>
            )}
        </div>


        {loading && <LeaderboardSkeleton />}

        {!loading && (
            <>
                {filteredData.length > 0 && (
                     <div className="grid grid-cols-[1fr_1.2fr_1fr] md:grid-cols-3 gap-4 md:gap-8 items-end max-w-4xl mx-auto mb-12 md:mb-16">
                        {podiumDisplayOrder.map((entry, index) => {
                            let rank: 1 | 2 | 3;
                            const sortedPodium = [...podiumData].sort((a,b) => b.score - a.score);
                            const originalIndex = sortedPodium.findIndex(p => p.id === entry.id);
                            rank = (originalIndex + 1) as 1 | 2 | 3;
                           
                            return <PodiumCard key={entry.id} entry={entry} rank={rank} />
                        })}
                    </div>
                )}
                
                <div className="space-y-2">
                    {listData.map((entry, index) => (
                        <Collapsible key={entry.id}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                                <CollapsibleTrigger className="flex items-center p-3 text-lg w-full">
                                    <div className="w-12 font-bold text-muted-foreground text-center">{index + 4}</div>
                                    <div className="flex items-center gap-4 flex-1 overflow-hidden text-left">
                                        <Image
                                            src={entry.avatarUrl}
                                            alt={entry.username}
                                            width={48}
                                            height={48}
                                            className="rounded-full border-2 border-primary/50 shrink-0"
                                        />
                                        <div className="truncate">
                                             <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors truncate">{entry.name}</a>
                                             <p className="text-sm text-muted-foreground truncate">@{entry.username}</p>
                                        </div>
                                    </div>
                                     <div className="text-xl font-bold text-primary flex items-center gap-2 shrink-0">
                                        <FlameIcon className="w-5 h-5" />
                                        <AnimatedNumber value={entry.score} /> / 1000
                                    </div>
                                </CollapsibleTrigger>
                                {entry.roast && (
                                <CollapsibleContent>
                                    <div className="bg-background/50 border-t border-b border-purple-500/20 p-4 mx-4 mb-4 rounded-lg">
                                        <p className="text-sm text-primary/90 italic text-center">"{entry.roast}"</p>
                                    </div>
                                </CollapsibleContent>
                                )}
                            </div>
                        </Collapsible>
                    ))}
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
                
                 <div className="flex items-center justify-center mt-8">
                     <p className="text-muted-foreground">Showing top {filteredData.length} users.</p>
                </div>
            </>
        )}
    </div>
  );
}
