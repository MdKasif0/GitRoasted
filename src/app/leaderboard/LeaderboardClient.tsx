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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Crown, Search, Trophy } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit, where, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sub, startOfMonth, startOfWeek } from 'date-fns';

type TimeFilter = 'all' | 'month' | 'week';

const PodiumCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: 1 | 2 | 3 }) => {
    const isFirst = rank === 1;
    return (
        <div className={cn(
            'relative flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300',
            isFirst ? 'border-primary/60 shadow-primary/20 shadow-2xl scale-110 z-10' : 'border-white/10 mt-8'
        )}>
            <div className="absolute top-0 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-2xl font-bold rounded-full bg-background border-2 border-white/10">{rank}</div>
             <Crown className={cn(
                'absolute top-4 right-4 w-7 h-7',
                isFirst ? 'text-primary' : 'text-white/30'
            )} />
            <Image
                src={entry.avatarUrl}
                alt={entry.username}
                width={isFirst ? 96 : 80}
                height={isFirst ? 96 : 80}
                className={cn('rounded-full border-4 shadow-lg mb-4',
                    isFirst ? 'border-primary' : 'border-white/20'
                )}
            />
            <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="text-xl font-bold hover:text-primary transition-colors">{entry.name}</a>
            <p className="text-muted-foreground">@{entry.username}</p>
            <div className="mt-4 text-2xl font-bold text-primary flex items-center gap-1">
                <FlameIcon className="w-5 h-5" />
                <AnimatedNumber value={entry.score} /> / 1000
            </div>
        </div>
    )
}

function LeaderboardSkeleton() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-4xl mx-auto mb-16">
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
  
  const leaderboardQuery = useMemo(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(50));
    
    if (timeFilter === 'month') {
        q = query(q, where('roastedAt', '>=', startOfMonth(new Date())));
    } else if (timeFilter === 'week') {
        q = query(q, where('roastedAt', '>=', startOfWeek(new Date())));
    }

    return q;
  }, [firestore, timeFilter]);
  
  const { data: leaderboardData, loading } = useCollection<LeaderboardEntry>(leaderboardQuery);

  const filteredData = useMemo(() => {
      if (!leaderboardData) return [];
      if (!searchTerm) return leaderboardData;
      return leaderboardData.filter(entry => 
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [leaderboardData, searchTerm])


  const podiumData = filteredData.slice(0, 3);
  const listData = filteredData.slice(3);
  
  // Re-order for podium display
  const podiumDisplayOrder = podiumData.length === 3 ? [podiumData[1], podiumData[0], podiumData[2]] : podiumData;


  return (
    <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500 mb-2 flex items-center justify-center gap-4">
                <Trophy className="w-12 h-12 text-primary" />
                Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The Hall of Flame: See the top-roasted legends and where you stand.
            </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative w-full md:w-1/2">
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

        {loading && <LeaderboardSkeleton />}

        {!loading && (
            <>
                {filteredData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-4xl mx-auto mb-16">
                        {podiumDisplayOrder.map((entry, index) => {
                            let rank: 1 | 2 | 3 = 1;
                             if(podiumData.length === 3) {
                                if (entry.id === podiumData[0].id) rank = 1;
                                if (entry.id === podiumData[1].id) rank = 2;
                                if (entry.id === podiumData[2].id) rank = 3;
                            } else {
                                rank = (index + 1) as 1 | 2 | 3;
                            }
                            return <PodiumCard key={entry.id} entry={entry} rank={rank} />
                        })}
                    </div>
                )}
                
                <div className="space-y-2">
                    {listData.map((entry, index) => (
                        <div key={entry.id} className="flex items-center p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-lg">
                            <div className="w-12 font-bold text-muted-foreground text-center">{index + 4}</div>
                            <div className="flex items-center gap-4 flex-1">
                                <Image
                                    src={entry.avatarUrl}
                                    alt={entry.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-primary/50"
                                />
                                <div>
                                     <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors">{entry.name}</a>
                                     <p className="text-sm text-muted-foreground">@{entry.username}</p>
                                </div>
                            </div>
                             <div className="text-xl font-bold text-primary flex items-center gap-2">
                                <FlameIcon className="w-5 h-5" />
                                <AnimatedNumber value={entry.score} /> / 1000
                            </div>
                        </div>
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
                
                {/* TODO: Add pagination and load more */}
                 <div className="flex items-center justify-center mt-8">
                     <p className="text-muted-foreground">Page 1 of 1</p>
                </div>
            </>
        )}
    </div>
  );
}

const FlameIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
