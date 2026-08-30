'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { AnimatedNumber } from './AnimatedNumber';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { FlameIcon } from './icons';

function LeaderboardSkeleton() {
    return (
        <div className="space-y-4 w-full">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            {Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="flex items-center p-4 bg-[#0A0A0A] rounded-xl border border-white/5">
                    <Skeleton className="h-6 w-8" />
                    <div className="flex items-center gap-4 ml-6">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-16 ml-auto" />
                </div>
            ))}
        </div>
    )
}

function PodiumItem({ entry, rank }: { entry: LeaderboardEntry, rank: 1 | 2 | 3 }) {
    const isFirst = rank === 1;
    
    // The exact visual classes based on rank
    const borderClass = isFirst ? 'border-[#FF8A00]' : rank === 2 ? 'border-slate-300' : 'border-amber-700';
    const glowClass = isFirst ? 'shadow-[0_0_30px_rgba(255,138,0,0.15)]' : 'shadow-none';
    const heightClass = isFirst ? 'md:-translate-y-4 z-10 scale-105' : 'md:translate-y-4 z-0';
    const iconColor = isFirst ? 'text-[#FF8A00]' : rank === 2 ? 'text-slate-300' : 'text-amber-700';
    
    return (
        <div className={`relative flex flex-col items-center p-6 bg-[#0A0A0A] border rounded-2xl ${borderClass} ${glowClass} ${heightClass} w-full md:w-[220px] transition-transform duration-300 hover:-translate-y-6`}>
            {/* Rank Badge */}
            <div className={`absolute -top-4 w-8 h-8 rounded-md bg-[#151515] border flex items-center justify-center font-bold text-sm ${borderClass} ${iconColor}`}>
               {rank}
            </div>
            
            <a href={`https://github.com/${entry.username}`} target="_blank" rel="noopener noreferrer" className="mt-4 mb-3 relative group">
                <Image
                    src={entry.avatarUrl}
                    alt={entry.username}
                    width={isFirst ? 80 : 64}
                    height={isFirst ? 80 : 64}
                    className={`rounded-full border-2 ${borderClass} shadow-lg`}
                />
            </a>
            
            <a href={`https://github.com/${entry.username}`} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-white hover:text-primary transition-colors text-center truncate w-full">
                {entry.username}
            </a>
            <p className="text-xs text-[#9CA3AF] mb-4 truncate w-full text-center">{entry.name || 'Developer'}</p>
            
            <div className={`text-2xl font-black ${isFirst ? 'text-primary' : 'text-white'} mb-2`}>
                <AnimatedNumber value={entry.score} />
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFirst ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>
                {entry.score > 800 ? 'Terminally Serious' : entry.score > 600 ? 'Needs Grass' : 'Code Addict'}
            </div>
        </div>
    );
}

export function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();
  const leaderboardData = leaderboard.slice(0, 10);
  
  const top3 = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-4 gap-4">
            <div className="flex items-center gap-4">
                <FlameIcon className="w-10 h-10 text-primary drop-shadow-[0_0_12px_rgba(255,138,0,0.4)]" />
                <div>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Hall of Flame</h2>
                   <p className="text-[#9CA3AF] text-sm mt-1">The most seriously roasted developers on GitHub.</p>
                </div>
            </div>
            <Button asChild variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-lg">
                <Link href="/leaderboard">
                    View full leaderboard <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>
        </div>

        {loading ? (
             <LeaderboardSkeleton />
        ) : (
             <div className="w-full border border-white/10 rounded-[32px] p-4 md:p-8 bg-[#050505]/50 backdrop-blur-sm relative overflow-hidden">
                {/* Podium for top 3 */}
                {top3.length >= 3 && (
                   <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 relative">
                       {/* SVG base glow under podium */}
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-primary/20 blur-2xl rounded-[100%]" />
                       
                       <div className="w-full md:w-auto order-2 md:order-1 flex justify-center">
                          <PodiumItem entry={top3[1]} rank={2} />
                       </div>
                       <div className="w-full md:w-auto order-1 md:order-2 flex justify-center z-10">
                          <PodiumItem entry={top3[0]} rank={1} />
                       </div>
                       <div className="w-full md:w-auto order-3 md:order-3 flex justify-center">
                          <PodiumItem entry={top3[2]} rank={3} />
                       </div>
                   </div>
                )}
                
                {/* List for remainder */}
                {remaining.length > 0 && (
                   <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
                       <div className="hidden md:grid grid-cols-[60px_1fr_150px_150px_40px] items-center px-6 py-4 border-b border-white/5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                           <div>Rank</div>
                           <div>User</div>
                           <div className="text-right pr-4">Seriousness Score</div>
                           <div className="text-center">Roast Level</div>
                           <div></div>
                       </div>
                       
                       <div className="flex flex-col divide-y divide-white/5">
                           {remaining.map((entry, index) => {
                               const rank = index + 4;
                               return (
                                   <Collapsible key={entry.username}>
                                       <div className="flex flex-col group">
                                           <CollapsibleTrigger asChild>
                                             <div className='flex flex-col md:grid md:grid-cols-[60px_1fr_150px_150px_40px] items-center px-6 py-4 hover:bg-[#151515] cursor-pointer transition-colors w-full gap-4 md:gap-0'>
                                               <div className="w-full md:w-auto flex items-center justify-between md:justify-start">
                                                   <span className="md:hidden text-xs text-[#9CA3AF] uppercase font-bold">Rank</span>
                                                   <div className="font-bold text-lg text-[#9CA3AF]">
                                                      {rank}
                                                   </div>
                                               </div>
                                               
                                               <div className='flex items-center gap-4 w-full md:w-auto'>
                                                   <Image
                                                   src={entry.avatarUrl}
                                                   alt={entry.username}
                                                   width={40}
                                                   height={40}
                                                   className="rounded-full"
                                                   />
                                                   <div className="flex flex-col items-start overflow-hidden">
                                                       <a href={`https://github.com/${entry.username}`} target='_blank' rel="noopener noreferrer" className="font-semibold text-white hover:text-primary transition-colors truncate">
                                                          {entry.username}
                                                       </a>
                                                       <p className="text-xs text-[#9CA3AF] truncate">{entry.name || 'Developer'}</p>
                                                   </div>
                                               </div>
                                               
                                               <div className="w-full md:w-auto flex items-center justify-between md:justify-end md:pr-4">
                                                   <span className="md:hidden text-xs text-[#9CA3AF] uppercase font-bold">Score</span>
                                                   <div className="font-bold text-primary text-lg">
                                                       <AnimatedNumber value={entry.score} />
                                                   </div>
                                               </div>
                                               
                                               <div className="w-full md:w-auto flex items-center justify-between md:justify-center">
                                                    <span className="md:hidden text-xs text-[#9CA3AF] uppercase font-bold">Level</span>
                                                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-[#9CA3AF] group-hover:border-white/20 transition-colors">
                                                        {entry.score > 550 ? 'Warning: High Ego' : 'Function Overload'}
                                                    </div>
                                               </div>
                                               
                                               <div className="hidden md:flex justify-end text-[#9CA3AF] group-hover:text-white">
                                                   <ArrowRight className="w-4 h-4" />
                                               </div>
                                             </div>
                                           </CollapsibleTrigger>
                                           {entry.roast && (
                                             <CollapsibleContent>
                                                 <div className="bg-[#050505] border-t border-b border-primary/20 p-4 mx-6 mb-4 rounded-xl mt-2">
                                                   <p className="text-sm italic text-white/80 leading-relaxed text-center">"{entry.roast}"</p>
                                                 </div>
                                             </CollapsibleContent>
                                           )}
                                       </div>
                                   </Collapsible>
                               );
                           })}
                       </div>
                   </div>
                )}
             </div>
        )}
    </div>
  );
}
