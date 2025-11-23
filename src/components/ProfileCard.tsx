import Image from 'next/image';
import { Github, Users, Star, Languages, TrendingUp, Calendar, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { RoastResultState, ScoreBreakdown } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareableCardDialog } from './ShareableCard';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Skeleton } from './ui/skeleton';

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

function AnimatedNumber({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const animation = {
      value: currentValue,
    };
    const targetValue = value;
    const duration = 1000;
    const startTime = performance.now();

    const updateValue = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCurrentValue(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setCurrentValue(targetValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value]);
  
  return <>{currentValue.toLocaleString()}</>;
}


export function ProfileCard({ result }: ProfileCardProps) {
  if (result.status !== 'success' || !result.user || !result.score || !result.breakdown) {
    return null;
  }

  const { user, score, roast, totalStars, topLanguages, breakdown } = result;

  const stats = [
    { icon: Star, label: 'Repositories', value: user.public_repos },
    { icon: Star, label: 'Total Stars', value: totalStars },
    { icon: Users, label: 'Followers', value: user.followers },
  ];

  return (
    <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-500">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={100}
          height={100}
          className="rounded-full border-4 border-primary transition-transform duration-300 hover:scale-110"
        />
        <div className="text-center sm:text-left">
          <CardTitle className="text-3xl font-bold">{user.name || user.login}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">@{user.login}</CardDescription>
          {user.bio && <p className="mt-2 text-foreground/80 max-w-lg">{user.bio}</p>}
          <Button asChild variant="ghost" className="mt-2 h-auto p-0 text-accent-foreground/70 hover:text-primary">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 p-4 rounded-lg transition-colors hover:bg-white/10">
              <stat.icon className="mx-auto h-6 w-6 text-primary mb-2" />
              <p className="text-3xl font-bold">
                <AnimatedNumber value={stat.value ?? 0} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {topLanguages && topLanguages.length > 0 && (
          <div className='mb-6'>
            <h3 className="text-center text-lg font-semibold text-muted-foreground mb-3 flex items-center justify-center gap-2"><Languages /> Top Languages</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {topLanguages.map(([language, count]) => (
                <Badge key={language} variant="secondary" className="text-base font-medium border-purple-500/20">
                  {language} <span className='ml-2 text-muted-foreground text-xs'>{count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-6 bg-purple-500/30" />

        <div className="text-center">
            <h3 className="text-xl font-semibold text-muted-foreground">Roast Score</h3>
            <p className="text-7xl font-bold text-primary my-2" style={{'--num': score} as React.CSSProperties}>
              <AnimatedNumber value={score} />
            </p>
            
            <Card className="mt-4 bg-background/50 border-purple-500/50 text-left">
                <CardHeader>
                <CardTitle>The Roast</CardTitle>
                </CardHeader>
                <CardContent>
                {roast ? (
                  <p className="text-lg leading-relaxed italic">"{roast}"</p>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                )}
                </CardContent>
            </Card>

            <Card className="mt-6 bg-transparent border-none text-left">
                <CardHeader className="p-2">
                    <CardTitle className='text-lg'>Score Breakdown</CardTitle>
                    <CardDescription>How the sausage gets made.</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
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
                </CardContent>
            </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <ShareableCardDialog result={result} />
        </div>
      </CardContent>
    </Card>
  );
}
