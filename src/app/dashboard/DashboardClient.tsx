
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Github, Users, Star, Languages, TrendingUp, Calendar, Zap, Download, Trophy, Sparkles, Building, Leaf, Package, BarChart, GitCommit, Heart, Code, Milestone, Users2, Lightbulb, Link as LinkIcon, BookOpen, Tag, CheckSquare, ArrowRight, ArrowLeft, GitBranch, User as UserIcon, AlertCircle } from 'lucide-react';
import { differenceInYears } from 'date-fns';

import type { RoastResultState, ScoreBreakdown, ScoreCategory, QuickWin as QuickWinType, DeveloperArchetype } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareableCardDialog } from '@/components/ShareableCardDialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FlameIcon } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { ScoreCircle } from '@/components/ScoreCircle';
import { calculateQuickWins } from '@/lib/quickWins';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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

const getScoreCelebration = (score: number) => {
    const invertedScore = 1000 - score;
    if (invertedScore >= 900) return { badgeText: 'Git Legend!', badgeIcon: <Trophy className="mr-1 h-4 w-4" />, badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', progressClass: 'stroke-yellow-400' };
    if (invertedScore >= 750) return { badgeText: 'Star Developer!', badgeIcon: <Sparkles className="mr-1 h-4 w-4" />, badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30', progressClass: 'stroke-purple-400' };
    if (invertedScore >= 500) return { badgeText: 'Keep Building!', badgeIcon: <Building className="mr-1 h-4 w-4" />, badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30', progressClass: 'stroke-blue-400' };
    return { badgeText: 'Every Expert Started Here!', badgeIcon: <Leaf className="mr-1 h-4 w-4" />, badgeClass: 'bg-green-500/10 text-green-400 border-green-500/30', progressClass: 'stroke-green-400' };
};

const iconMap: { [key: string]: React.ElementType } = {
  'add-readme': BookOpen,
  'add-bio': UserIcon,
  'add-topics': Tag,
  'add-license': BookOpen,
  'build-streak': FlameIcon,
  'increase-activity': Zap,
  'complete-profile': UserIcon,
  'add-ci': GitBranch,
  'learn-languages': Languages,
  'improve-ratio': Users,
};


function QuickWinCard({ win }: { win: QuickWinType; }) {
  const difficultyColors = {
    easy: 'border-green-500/80 bg-green-500/10 text-green-400',
    medium: 'border-yellow-500/80 bg-yellow-500/10 text-yellow-400',
    hard: 'border-red-500/80 bg-red-500/10 text-red-400'
  }
  const difficultyBadgeColors = {
    easy: 'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  const Icon = iconMap[win.id] || Lightbulb;

  return (
    <Card className={cn(
        "win-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50",
        difficultyColors[win.difficulty],
        "border-l-4"
        )}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
             <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>{win.title}</CardTitle>
             <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <Badge variant="outline" className={cn("capitalize", difficultyBadgeColors[win.difficulty])}>{win.difficulty}</Badge>
                <span>⏱️ {win.timeEstimate}</span>
             </div>
          </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground mb-4">{win.description}</p>
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-white/10">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-3xl font-bold text-green-400">+{win.pointsGain}</div>
                <div className="text-xs text-muted-foreground -mt-1">points</div>
            </div>
            {win.actionUrl && (
            <Button asChild size="sm" className='w-full md:w-auto group'>
                <a 
                href={win.actionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-button"
                >
                Take Action <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
            </Button>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardContent({ result, wins }: { result: RoastResultState, wins: QuickWinType[] }) {
    if (result.status !== 'success' || !result.user || !result.score || !result.breakdown || !result.events) {
        return null;
    }

    const { user, score, roast, totalStars, topLanguages, breakdown, events, archetype } = result;
    const celebration = getScoreCelebration(score);
    const invertedScore = 1000 - score;
    const roastLines = roast?.split('\n').filter(line => line.trim() !== '') || [];
    const totalContributions = events.filter(e => e.type === 'PushEvent').length;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <header className="mb-8">
                <Button asChild variant="outline" className="mb-4 bg-white/5 border-white/10 md:w-auto w-10 h-10 p-0 md:px-4 md:py-2">
                    <Link href={`/?username=${user.login}`}>
                        <ArrowLeft className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">Back to Roast</span>
                    </Link>
                </Button>
                 <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">Dashboard for @{user.login}</h1>
                <p className="text-lg text-muted-foreground mt-1">
                    Your complete GitHub analysis and improvement plan.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Sticky Column --- */}
                <aside className="lg:col-span-1 lg:sticky top-8 self-start space-y-8">
                    <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 text-center">
                        <CardContent className="p-6">
                            <Image
                                src={user.avatar_url}
                                alt={user.login}
                                width={128}
                                height={128}
                                className="rounded-full border-4 border-primary transition-transform duration-300 hover:scale-110 glow mx-auto"
                            />
                            <h2 className="text-3xl font-bold mt-4">{user.name || user.login}</h2>
                            <p className="text-lg text-muted-foreground">@{user.login}</p>
                             <div className="my-6">
                                <ScoreCircle value={invertedScore} />
                                {celebration && (
                                    <Badge className={`mt-3 text-base mx-auto ${celebration.badgeClass}`}>
                                        {celebration.badgeIcon}
                                        {celebration.badgeText}
                                    </Badge>
                                )}
                            </div>
                            <div className='w-full space-y-2 mt-4'>
                                <ShareableCardDialog result={result} />
                                <Button asChild variant="outline" className="w-full bg-white/5 border-white/10">
                                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-4 w-4" />
                                        View on GitHub
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* --- Right Scrollable Column --- */}
                <main className="lg:col-span-2 space-y-8">
                    {/* Roast Section */}
                    <Card className="bg-background/50 border-purple-500/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FlameIcon className="text-primary"/> Your Roast
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg leading-relaxed italic space-y-2 font-serif">
                                {roastLines.map((line, index) => <p key={index}>{line}</p>)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Analysis */}
                    {archetype && (
                         <Card className="bg-background/50 border-purple-500/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Users2 className="text-primary"/> Profile Analysis
                                </CardTitle>
                                <CardDescription>
                                    Based on your activity, you fit the <span className='font-bold text-primary'>{archetype.type}</span> archetype.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className='italic text-muted-foreground'>{archetype.description}</p>
                                <div className='space-y-2'>
                                    <h4 className='font-semibold'>Common Traits:</h4>
                                    <ul className='space-y-2'>
                                        {archetype.characteristics.map((trait, index) => (
                                            <li key={index} className='flex items-start gap-2 text-sm'>
                                                <CheckSquare className='w-4 h-4 mt-0.5 text-green-500 shrink-0' />
                                                <span>{trait}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats & Score Breakdown */}
                    <Accordion type="multiple" className="w-full space-y-8" defaultValue={['stats', 'breakdown', 'quick-wins']}>
                        {/* Stats at a Glance */}
                        <AccordionItem value="stats" className='border-none'>
                            <Card className="bg-background/50 border-purple-500/50">
                                <AccordionTrigger className='p-6 hover:no-underline'>
                                    <CardTitle className='text-xl flex items-center gap-2'><BarChart className='text-primary' /> Stats at a Glance</CardTitle>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="bg-white/5 p-4 rounded-lg text-center"><Star className="mx-auto h-6 w-6 text-primary mb-2" /><p className="text-2xl font-bold"><AnimatedNumber value={totalStars ?? 0} /></p><p className="text-xs text-muted-foreground">Stars Received</p></div>
                                        <div className="bg-white/5 p-4 rounded-lg text-center"><Users className="mx-auto h-6 w-6 text-primary mb-2" /><p className="text-2xl font-bold"><AnimatedNumber value={user.followers} /></p><p className="text-xs text-muted-foreground">Followers</p></div>
                                        <div className="bg-white/5 p-4 rounded-lg text-center"><Users2 className="mx-auto h-6 w-6 text-primary mb-2" /><p className="text-2xl font-bold"><AnimatedNumber value={user.following} /></p><p className="text-xs text-muted-foreground">Following</p></div>
                                        <div className="bg-white/5 p-4 rounded-lg text-center"><Package className="mx-auto h-6 w-6 text-primary mb-2" /><p className="text-2xl font-bold"><AnimatedNumber value={user.public_repos} /></p><p className="text-xs text-muted-foreground">Public Repos</p></div>
                                        <div className="bg-white/5 p-4 rounded-lg text-center"><GitCommit className="mx-auto h-6 w-6 text-primary mb-2" /><p className="text-2xl font-bold"><AnimatedNumber value={totalContributions} /></p><p className="text-xs text-muted-foreground">Total Commits (year)</p></div>
                                        {topLanguages && topLanguages.length > 0 && <div className="bg-white/5 p-4 rounded-lg text-center col-span-2 sm:col-span-1"><Languages className="mx-auto h-6 w-6 text-primary mb-2" /><div className="flex flex-wrap justify-center gap-1 mt-2">{topLanguages.map(([language]) => <Badge key={language} variant="secondary" className="text-xs font-medium border-purple-500/20">{language}</Badge>)}</div><p className="text-xs text-muted-foreground mt-1">Top Languages</p></div>}
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Score Breakdown */}
                        <AccordionItem value="breakdown" className='border-none'>
                            <Card className="bg-background/50 border-purple-500/50">
                                <AccordionTrigger className='p-6 hover:no-underline'>
                                    <CardTitle className='text-xl flex items-center gap-2'><Trophy className='text-primary' /> Score Breakdown</CardTitle>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 space-y-4">
                                    {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => {
                                        const category = breakdown[key as keyof ScoreBreakdown];
                                        if (key === 'specialBonus' && category.total === 0) return null;
                                        const meta = breakdownMeta[key as keyof ScoreBreakdown];
                                        const percentage = (category.total / meta.maxScore) * 100;
                                        const indicatorClass = percentage > 75 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500';
                                        return (
                                            <div key={key}>
                                                <TooltipProvider><Tooltip delayDuration={100}><TooltipTrigger className='w-full text-left'><div className="flex items-center gap-2 text-sm mb-2"><meta.icon className="h-4 w-4 text-muted-foreground" /><span className='flex-1 font-semibold text-base'>{meta.label}</span><span className='text-primary font-bold'>{category.total} / {meta.maxScore} pts</span></div><Progress value={percentage} indicatorClassName={indicatorClass} /></TooltipTrigger><TooltipContent><p>{meta.description}</p></TooltipContent></Tooltip></TooltipProvider>
                                                <div className='mt-3 space-y-2 pl-6 border-l-2 border-purple-500/20'>{Object.entries(category.breakdown).map(([subKey, subValue]) => <div key={subKey} className="flex justify-between items-center text-xs"><span className='text-muted-foreground'>{subKey}</span><span className='font-mono'>{subValue} pts</span></div>)}</div>
                                            </div>
                                        )
                                    })}
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Quick Wins */}
                         <AccordionItem value="quick-wins" className='border-none'>
                            <Card className="bg-background/50 border-purple-500/50">
                                <AccordionTrigger className='p-6 hover:no-underline'>
                                    <CardTitle className='text-xl flex items-center gap-2'><Lightbulb className='text-primary' /> Quick Wins</CardTitle>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                     <div className="grid md:grid-cols-2 gap-6">
                                        {wins.map((win) => (
                                          <QuickWinCard key={win.id} win={win} />
                                        ))}
                                      </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                    </Accordion>
                </main>
            </div>
        </div>
    );
}

export function DashboardClient() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [result, setResult] = useState<RoastResultState | null>(null);
  const [wins, setWins] = useState<QuickWinType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided. Please go back and roast a user first.');
      setLoading(false);
      return;
    }

    try {
      const cachedDataString = localStorage.getItem(`gitroasted_data_${username.toLowerCase()}`);
      if (!cachedDataString) {
        setError(`No roast data found for "${username}". Please go back and roast this user to see their Dashboard.`);
        setLoading(false);
        return;
      }

      const userData: RoastResultState = JSON.parse(cachedDataString);

      if (userData.status !== 'success') {
          setError(`Could not load Dashboard. The last roast for "${username}" was not successful.`);
          setLoading(false);
          return;
      }

      const quickWins = calculateQuickWins(userData);
      setResult(userData);
      setWins(quickWins);
    } catch (e) {
        console.error("Failed to load or parse data for Dashboard", e);
        setError("An error occurred while loading the Dashboard data.");
    } finally {
        setLoading(false);
    }
  }, [username]);

  if (loading) {
    return null; // The parent page will show the skeleton
  }

  if (error || !result) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Dashboard</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred.'}
                </AlertDescription>
            </Alert>
             <Button asChild>
                <Link href={username ? `/?username=${username}` : '/'}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Roast
                </Link>
            </Button>
        </div>
    );
  }

  return <DashboardContent result={result} wins={wins} />;
}
