

import Image from 'next/image';
import { Github, Users, Star, Languages, TrendingUp, Calendar, Zap, Download, Trophy, Sparkles, Building, Leaf, Package, BarChart, GitCommit, Heart, Code, Milestone, Users2 } from 'lucide-react';
import React from 'react';
import { differenceInYears } from 'date-fns';

import type { RoastResultState, ScoreBreakdown, ScoreCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareableCardDialog } from './ShareableCard';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FlameIcon } from './icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AnimatedNumber } from './AnimatedNumber';
import { ScoreCircle } from './ScoreCircle';


interface ProfileCardProps {
  result: RoastResultState;
}

const breakdownMeta: Record<keyof ScoreBreakdown, { label: string; icon: React.ElementType, description: string, maxScore: number }> = {
    impact: { label: 'Impact', icon: Package, description: 'Repository impact & stars', maxScore: 250 },
    consistency: { label: 'Consistency', icon: Calendar, description: 'Contribution frequency & streaks', maxScore: 200 },
    quality: { label: 'Quality', icon: GitCommit, description: 'Code quality indicators', maxScore: 150 },
    community: { label: 'Community', icon: Heart, description: 'Social engagement & collaboration', maxScore: 150 },
    diversity: { label: 'Diversity', icon: Code, description: 'Technology breadth', maxScore: 100 },
    experience: { label: 'Experience', icon: Milestone, description: 'Account age & maturity', maxScore: 75 },
    activity: { label: 'Activity', icon: Zap, description: 'Recent activity', maxScore: 50 },
    specialBonus: { label: 'Special Bonus', icon: Sparkles, description: 'Exceptional achievements', maxScore: 25 },
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

const getScoreCelebration = (score: number) => {
    const invertedScore = 1000 - score; // Celebrate the "seriousness" score
    const percentage = invertedScore / 10;
    
    if (percentage >= 90) {
        return {
            badgeText: 'Git Legend!',
            badgeIcon: <Trophy className="mr-1 h-4 w-4" />,
            badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            progressClass: 'stroke-yellow-400',
        };
    }
    if (percentage >= 75) {
        return {
            badgeText: 'Star Developer!',
            badgeIcon: <Sparkles className="mr-1 h-4 w-4" />,
            badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            progressClass: 'stroke-purple-400',
        };
    }
    if (percentage >= 50) {
        return {
            badgeText: 'Keep Building!',
            badgeIcon: <Building className="mr-1 h-4 w-4" />,
            badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            progressClass: 'stroke-blue-400',
        };
    }
    return {
        badgeText: 'Every Expert Started Here!',
        badgeIcon: <Leaf className="mr-1 h-4 w-4" />,
        badgeClass: 'bg-green-500/10 text-green-400 border-green-500/30',
        progressClass: 'stroke-green-400',
    };
};

function ProfileCardComponent({ result }: ProfileCardProps) {
  if (result.status !== 'success' || !result.user || !result.score || !result.breakdown || !result.events) {
    return null;
  }

  const { user, score, roast, totalStars, topLanguages, breakdown, events } = result;

  const accountAge = differenceInYears(new Date(), new Date(user.created_at));
  const totalContributions = events.filter(e => e.type === 'PushEvent').length;
  const roastLines = roast?.split('\n').filter(line => line.trim() !== '') || [];
  const celebration = getScoreCelebration(score);
  const invertedScore = 1000 - score;

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
             {celebration && (
              <Badge className={`mt-3 text-base ${celebration.badgeClass}`}>
                {celebration.badgeIcon}
                {celebration.badgeText}
              </Badge>
            )}
            <ScoreCircle value={score} indicatorClassName={celebration.progressClass} />

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
                    <div className="text-lg leading-relaxed italic space-y-2">
                        {roastLines.map((line, index) => (
                          <p 
                            key={index}
                            className="roast-line"
                            style={{ animationDelay: `${index * 1.5}s` }}
                          >
                            {line}
                          </p>
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
                        <AccordionContent className="px-6 pb-6 space-y-4">
                            {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
                                const category = breakdown[key as keyof ScoreBreakdown] as ScoreCategory;
                                if (key === 'specialBonus' && category.total === 0) return null;
                                
                                const meta = breakdownMeta[key as keyof ScoreBreakdown];
                                const percentage = (category.total / meta.maxScore) * 100;
                                const indicatorClass = percentage > 75 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500';

                                return (
                                    <div key={key}>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger className='w-full text-left'>
                                                    <div className="flex items-center gap-2 text-sm mb-2">
                                                        <meta.icon className="h-4 w-4 text-muted-foreground" />
                                                        <span className='flex-1 font-semibold text-base'>{meta.label}</span>
                                                        <span className='text-primary font-bold'>{category.total} / {meta.maxScore} pts</span>
                                                    </div>
                                                    <Progress value={percentage} indicatorClassName={indicatorClass} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{meta.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <div className='mt-3 space-y-2 pl-6 border-l-2 border-purple-500/20'>
                                            {Object.entries(category.breakdown).map(([subKey, subValue]) => (
                                                <div key={subKey} className="flex justify-between items-center text-xs">
                                                    <span className='text-muted-foreground'>{subKey}</span>
                                                    <span className='font-mono'>{subValue} pts</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <StatCard icon={Star} label="Stars Received" value={totalStars ?? 0} />
                <StatCard icon={Users} label="Followers" value={user.followers} />
                <StatCard icon={Users2} label="Following" value={user.following} />
                <StatCard icon={Calendar} label="Account Age" value={`${accountAge} yrs`} />
                <StatCard icon={GitCommit} label="Total Contributions" value={totalContributions} />
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

export const ProfileCard = React.memo(ProfileCardComponent);
