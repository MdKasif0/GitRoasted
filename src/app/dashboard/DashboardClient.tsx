'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Github, ArrowRight, Check, ChevronDown, ChevronUp, AlertCircle, ArrowLeft } from 'lucide-react';

import type { RoastResultState, ScoreBreakdown, ScoreCategory, QuickWin as QuickWinType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShareableCardDialog } from '@/components/ShareableCardDialog';
import { calculateQuickWins } from '@/lib/quickWins';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlameIcon } from '@/components/icons';

const breakdownMeta: Record<keyof ScoreBreakdown, { label: string; maxScore: number }> = {
    impact: { label: 'Impact', maxScore: 250 },
    consistency: { label: 'Consistency', maxScore: 200 },
    quality: { label: 'Quality', maxScore: 150 },
    community: { label: 'Community', maxScore: 150 },
    diversity: { label: 'Diversity', maxScore: 100 },
    experience: { label: 'Experience', maxScore: 75 },
    activity: { label: 'Activity', maxScore: 50 },
    specialBonus: { label: 'Special Bonus', maxScore: 25 },
};

const getScoreCelebration = (score: number) => {
    const invertedScore = 1000 - score;
    if (invertedScore >= 900) return '🔥 Git Legend';
    if (invertedScore >= 750) return '✨ Star Developer';
    if (invertedScore >= 500) return '🏗️ Rising Developer';
    return '🌱 Fresh Install';
};

function TopNav({ username }: { username: string }) {
    return (
        <header className="w-full flex items-center justify-between py-6 mb-12 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
                <FlameIcon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold tracking-tight text-white">GitRoasted</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href={`/?username=${username}`} className="hover:text-white transition-colors flex items-center gap-1">
                    Roast another <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/#leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                </a>
            </nav>
            <div className="md:hidden">
                 <Link href={`/?username=${username}`} className="text-sm font-medium text-primary flex items-center gap-1">
                    Roast another <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </header>
    );
}

function ScoreRow({ category, data }: { category: keyof ScoreBreakdown, data: ScoreCategory }) {
    const [expanded, setExpanded] = useState(false);
    const meta = breakdownMeta[category];
    if (category === 'specialBonus' && data.total === 0) return null;
    
    const percentage = (data.total / meta.maxScore) * 100;
    
    return (
        <div className="border-b border-white/5 last:border-0 py-4">
            <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <span className="font-medium text-white w-28">{meta.label}</span>
                    <div className="flex-1 max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                        <div 
                            className="h-full bg-primary/80 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                     <div className="text-sm font-mono text-muted-foreground group-hover:text-white transition-colors">
                        <span className="text-white">{data.total}</span> / {meta.maxScore}
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>
            
            {expanded && (
                <div className="mt-4 pl-0 sm:pl-[128px] space-y-2 animate-in slide-in-from-top-2 opacity-0 fade-in duration-200">
                    {Object.entries(data.breakdown).map(([subKey, subValue]) => (
                        <div key={subKey} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{subKey}</span>
                            <span className="font-mono text-white/70">{subValue} pts</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function DashboardContent({ result, wins }: { result: RoastResultState, wins: QuickWinType[] }) {
    if (result.status !== 'success' || !result.user || !result.score || !result.breakdown || !result.events) {
        return null;
    }

    const { user, score, roast, totalStars, topLanguages, breakdown, events, archetype } = result;
    const badgeText = getScoreCelebration(score);
    const invertedScore = 1000 - score;
    const roastLines = roast?.split('\n').filter(line => line.trim() !== '') || [];
    const totalContributions = events.filter(e => e.type === 'PushEvent').length;

    return (
        <div className="w-full min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-primary/30 relative">
            {/* Extremely subtle background depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-16 pb-32 relative z-10">
                <TopNav username={user.login} />

                {/* --- Profile Hero --- */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="flex items-center gap-6">
                        <Image
                            src={user.avatar_url}
                            alt={user.login}
                            width={96}
                            height={96}
                            className="rounded-full border border-primary/40 shadow-[0_0_15px_rgba(255,138,0,0.1)]"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{user.name || user.login}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground font-mono">
                                <span>@{user.login}</span>
                                <span className="hidden sm:inline text-white/20">•</span>
                                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                                    <Github className="w-3 h-3" /> github.com/{user.login}
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-2">
                        <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Seriousness Score</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-primary tracking-tighter">{invertedScore}</span>
                            <span className="text-xl text-muted-foreground">/ 1000</span>
                        </div>
                        <div className="text-sm font-medium text-white/80 bg-white/5 border border-white/10 px-3 py-1 rounded-md">
                            {badgeText}
                        </div>
                    </div>
                </section>

                {/* --- Primary Actions --- */}
                <div className="flex flex-wrap items-center gap-3 mb-24">
                    <ShareableCardDialog result={result} />
                    <Button asChild size="sm" variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 transition-colors h-9 px-6 shadow-none">
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" /> View on GitHub
                        </a>
                    </Button>
                </div>

                {/* --- The Roast --- */}
                <section className="mb-24 max-w-[800px]">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-6">
                        <FlameIcon className="w-3 h-3" /> The Roast
                    </div>
                    <div className="border-l-2 border-primary pl-6 md:pl-8 space-y-6">
                        {roastLines.map((line, index) => (
                            <p key={index} className="text-xl md:text-2xl leading-[1.6] text-white/90">
                                {line}
                            </p>
                        ))}
                    </div>
                    <div className="mt-6 pl-6 md:pl-8 text-xs text-muted-foreground">
                        Generated from public GitHub activity
                    </div>
                </section>

                <div className="w-full h-px bg-white/5 mb-24" />

                {/* --- Quick Wins & Profile Analysis Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    
                    {/* Quick Wins */}
                    <section>
                        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8">Quick Wins</h2>
                        <div className="space-y-4">
                            {wins.map((win, idx) => (
                                <div key={win.id} className="flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-white/5 transition-colors group">
                                    <div className="text-xs font-mono text-muted-foreground pt-1.5 w-6">0{idx + 1}</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{win.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{win.timeEstimate}</div>
                                    </div>
                                    <div className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                        +{win.pointsGain}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Profile Analysis */}
                    {archetype && (
                        <section>
                            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8">Profile Analysis</h2>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{archetype.type}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{archetype.description}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">Common Traits</h4>
                                <ul className="space-y-3">
                                    {archetype.characteristics.map((trait, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-white/80">
                                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{trait}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}
                </div>

                <div className="w-full h-px bg-white/5 mb-24" />

                {/* --- Stats Grid --- */}
                <section className="mb-24">
                    <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8">Stats At A Glance</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{totalStars ?? 0}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Stars</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{user.followers}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{user.following}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{user.public_repos}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Repos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{totalContributions}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Commits</div>
                        </div>
                    </div>
                    
                    {topLanguages && topLanguages.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4">Top Languages</h3>
                            <div className="flex flex-wrap items-center gap-3">
                                {topLanguages.map(([language]) => (
                                    <span key={language} className="text-sm font-medium text-white/70 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <div className="w-full h-px bg-white/5 mb-24" />

                {/* --- Score Breakdown --- */}
                <section>
                    <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-8">Score Breakdown</h2>
                    <div className="max-w-[800px]">
                        {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => (
                            <ScoreRow key={key} category={key} data={breakdown[key]} />
                        ))}
                    </div>
                </section>

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
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
    );
  }

  if (error || !result) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <AlertTitle>Could Not Load Dashboard</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred.'}
                </AlertDescription>
            </Alert>
             <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
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
