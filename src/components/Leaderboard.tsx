
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
import { Trophy } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { AnimatedNumber } from './AnimatedNumber';

function LeaderboardSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b-purple-500/30">
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Seriousness Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                     <TableRow key={i} className="hover:bg-white/5 border-b-purple-500/10">
                        <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
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
                    <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-purple-500/30">
                        <TableHead className="w-[50px]">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Seriousness Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData.map((entry, index) => (
                        <TableRow key={entry.id} className="hover:bg-white/5 border-b-purple-500/10">
                            <TableCell className="font-medium text-lg text-center">
                               {getRankContent(index)}
                            </TableCell>
                            <TableCell>
                            <div className="flex items-center gap-3">
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
                            </TableCell>
                            <TableCell className="text-right font-bold text-primary text-lg">
                                <AnimatedNumber value={entry.score} />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                )}
                 {!loading && (!leaderboardData || leaderboardData.length === 0) && (
                    <div className="text-center p-8 text-muted-foreground">
                        The Hall of Flame is empty. Be the first to get roasted and claim the top spot!
                    </div>
                 )}
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
