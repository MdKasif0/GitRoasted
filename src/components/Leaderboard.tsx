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
import { mockLeaderboardData } from '@/lib/leaderboard-data';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  return (
    <div className="w-full">
       <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tighter">Hall of Flame</h2>
        <p className="text-muted-foreground text-lg mt-2">The top-roasted legends on GitHub.</p>
       </div>
        <Card className="w-full bg-black/20 backdrop-blur-lg border-purple-500/30">
        <CardContent className="p-0">
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b-purple-500/30">
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Roast Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockLeaderboardData.map((entry) => (
                <TableRow key={entry.rank} className="hover:bg-white/5 border-b-purple-500/10">
                    <TableCell className="font-medium text-lg text-center">
                        {entry.rank === 1 && '🥇'}
                        {entry.rank === 2 && '🥈'}
                        {entry.rank === 3 && '🥉'}
                        {entry.rank > 3 && entry.rank}
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
                    <TableCell className="text-right font-bold text-primary text-lg">{entry.score}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}