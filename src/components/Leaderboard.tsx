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
import { FlameIcon } from './icons';

export function Leaderboard() {
  return (
    <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FlameIcon className="w-6 h-6 text-primary" />
          Top Roasted
        </CardTitle>
        <CardDescription>The hall of flame for GitHub's finest.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Roast Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboardData.map((entry) => (
              <TableRow key={entry.rank} className="hover:bg-white/5">
                <TableCell className="font-medium text-lg">{entry.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={entry.avatarUrl}
                      alt={entry.username}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary/50"
                    />
                    <span className="font-medium">{entry.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-primary text-lg">{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
