import Image from 'next/image';
import { Github, Users, Star, Languages, TrendingUp, Calendar, Zap, Download } from 'lucide-react';
import React from 'react';
import { differenceInYears } from 'date-fns';

import type { RoastResultState, ScoreBreakdown } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareableCardDialog } from './ShareableCard';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { FlameIcon } from './icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AnimatedNumber } from './AnimatedNumber';
import { ScoreCircle } from './ScoreCircle';


interface ProfileCardProps {
  result: RoastResultState;
}

const breakdownMeta: Record<keyof ScoreBreakdown, { label: string; icon: React.ElementType, description: string }> = {
    stars: { label: 'Star Power', icon: Star, description: 'Points from total stars on repos.' },
    followerRatio: { label: 'Influence', icon: Users, description: 'Points from followers to following ratio.' },
    followerCount: { label: 'Popularity', icon: TrendingUp, description: 'Points from raw follower count.' },
    contributionFrequency: { label: 'Consistency', icon: Calendar, description: 'Points from active contribution days in the last year.' },
    accountAge: { label: 'Veteran Status', icon: Github, description: 'Points from account age.' },
    totalContributions: { label: 'Work Ethic', icon: Zap, description: 'Points from total commit count.' },
}

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="bg-white/5 p-4 rounded-lg transition-colors hover:bg-white/10 text-center">
        <Icon className="mx-auto h-6 w-6 text-primary mb-2" />
        <p className="text-2xl font-bold">
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
)

export function ProfileCard({ result }: ProfileCardProps) {
  if (result.status !== 'success' || !result.user || !result.score || !result.breakdown || !result.events) {
    return null;
  }

  const { user, score, roast, totalStars, topLanguages, breakdown, events } = result;

  const accountAge = differenceInYears(new Date(), new Date(user.created_at));
  const totalContributions = events.filter(e => e.type === 'PushEvent').length;
  const roastLines = roast?.split('\n').filter(line => line.trim() !== '') || [];

  return (
    <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-500">
      <CardContent className="p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={128}
              height={128}
              className="rounded-full border-4 border-primary transition-transform duration-300 hover:scale-110 glow"
            />
            <h2 className="text-3xl font-bold mt-4">{user.name || user.login}</h2>
            <p className="text-lg text-muted-foreground">@{user.login}</p>
            {user.bio && <p className="mt-2 text-foreground/80 text-sm max-w-xs">{user.bio}</p>}
            
            <ScoreCircle value={score} />

            <div className='w-full space-y-2 mt-4'>
                <ShareableCardDialog result={result} />
                 <Button asChild variant="outline" className="w-full bg-white/5 border-white/10">
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    </a>
                </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <Card className="bg-background/50 border-purple-500/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlameIcon className="text-primary"/> Your Roast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-lg leading-relaxed italic typewriter-multiline">
                        {roastLines.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full mt-6" defaultValue='breakdown'>
                <AccordionItem value="breakdown" className='border-none'>
                    <Card className="bg-background/50 border-purple-500/50">
                        <AccordionTrigger className='p-6 hover:no-underline'>
                            <CardTitle className='text-lg'>Score Breakdown</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <TooltipProvider>
                                <div className="space-y-4">
                                    {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
                                        const meta = breakdownMeta[key];
                                        const value = breakdown[key];
                                        const max = 100 / Object.keys(breakdown).length;
                                        const percentage = (value / max) * 100;
                                        return (
                                            <Tooltip key={key} delayDuration={100}>
                                                <TooltipTrigger className='w-full text-left'>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <meta.icon className="h-4 w-4 text-muted-foreground" />
                                                        <span className='flex-1 font-medium'>{meta.label}</span>
                                                        <span className='text-primary font-bold'>{value} pts</span>
                                                    </div>
                                                    <Progress value={percentage} className="h-2 mt-1" indicatorClassName={percentage > 75 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{meta.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            </TooltipProvider>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <StatCard icon={Star} label="Stars Received" value={totalStars ?? 0} />
                <StatCard icon={Users} label="Followers" value={user.followers} />
                <StatCard icon={Users} label="Following" value={user.following} />
                <StatCard icon={Calendar} label="Account Age" value={`${accountAge} yrs`} />
                <StatCard icon={Zap} label="Total Contributions" value={totalContributions} />
                {topLanguages && topLanguages.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg transition-colors hover:bg-white/10 text-center col-span-2 sm:col-span-1">
                    <Languages className="mx-auto h-6 w-6 text-primary mb-2" />
                     <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {topLanguages.map(([language]) => (
                            <Badge key={language} variant="secondary" className="text-xs font-medium border-purple-500/20">
                            {language}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Top Languages</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
