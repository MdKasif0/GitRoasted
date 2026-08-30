'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
    Github, Menu, Quote, Zap, User as UserIcon, Check, Trophy, ChevronDown, 
    ChevronUp, Share2, Copy, Download, Star, Users, GitCommit, SearchCode,
    LayoutDashboard, Activity, AlertCircle, Home, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import type { RoastResultState, ScoreBreakdown, ScoreCategory, QuickWin as QuickWinType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShareableCardDialog } from '@/components/ShareableCardDialog';
import { calculateQuickWins } from '@/lib/quickWins';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlameIcon } from '@/components/icons';

const breakdownMeta: Record<keyof ScoreBreakdown, { label: string; maxScore: number; icon: React.ElementType }> = {
    impact: { label: 'Impact', maxScore: 250, icon: SearchCode },
    consistency: { label: 'Consistency', maxScore: 200, icon: LayoutDashboard },
    quality: { label: 'Quality', maxScore: 150, icon: SearchCode },
    community: { label: 'Community', maxScore: 150, icon: Users },
    diversity: { label: 'Diversity', maxScore: 100, icon: SearchCode },
    experience: { label: 'Experience', maxScore: 75, icon: LayoutDashboard },
    activity: { label: 'Activity', maxScore: 50, icon: Activity },
    specialBonus: { label: 'Special Bonus', maxScore: 25, icon: Star },
};

const getScoreCelebration = (score: number) => {
    const invertedScore = 1000 - score;
    if (invertedScore >= 900) return 'Git Legend';
    if (invertedScore >= 750) return 'Star Developer';
    if (invertedScore >= 500) return 'Rising Developer';
    return 'Fresh Install';
};

const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
};

function SegmentedProgressBar({ score }: { score: number }) {
    const totalSegments = 10;
    const filledSegments = Math.round((score / 1000) * totalSegments);
    
    return (
        <div className="flex gap-1 h-3 w-full">
            {Array.from({ length: totalSegments }).map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "flex-1 rounded-sm",
                        i < filledSegments ? "bg-orange-500" : "bg-white/10"
                    )}
                />
            ))}
        </div>
    );
}

function TopNav() {
    return (
        <header className="w-full flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 group">
                <FlameIcon className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold tracking-tight text-white">GitRoasted</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                <div className="relative">
                    <Link href="/" className="text-white flex items-center gap-2">
                        <FlameIcon className="w-4 h-4 text-orange-500" /> Roast another
                    </Link>
                    <div className="absolute -bottom-7 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
                </div>
                <Link href="/#leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-4">
                <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                </a>
                <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white rounded-full px-4 h-9">
                    <Menu className="w-4 h-4 mr-2" /> Menu
                </Button>
            </div>
        </header>
    );
}

function ScoreRow({ category, data }: { category: keyof ScoreBreakdown, data: ScoreCategory }) {
    const [expanded, setExpanded] = useState(false);
    const meta = breakdownMeta[category];
    if (category === 'specialBonus' && data.total === 0) return null;
    
    const percentage = (data.total / meta.maxScore) * 100;
    const colorClass = getProgressBarColor(percentage);
    const Icon = meta.icon;
    
    return (
        <div className="border-b border-white/5 last:border-0 py-4">
            <div 
                className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3 w-40">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-white/90">{meta.label}</span>
                </div>
                
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                    <div 
                        className={cn("h-full rounded-full transition-all duration-1000", colorClass)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex items-center gap-4 w-32 justify-end">
                     <div className="text-sm font-mono text-muted-foreground group-hover:text-white transition-colors">
                        <span className="text-orange-500 font-bold">{data.total}</span> / {meta.maxScore}
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>
            
            {expanded && (
                <div className="mt-4 pl-[172px] space-y-2 animate-in slide-in-from-top-2 opacity-0 fade-in duration-200">
                    {Object.entries(data.breakdown).map(([subKey, subValue]) => (
                        <div key={subKey} className="flex justify-between items-center text-sm max-w-[300px]">
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
    const formattedDate = format(new Date(), 'MMM dd, yyyy');

    return (
        <div className="w-full min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-orange-500/30 relative overflow-hidden">
            {/* Subtle Dot Pattern Background */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,140,0,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                    maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 100%)'
                }}
            />
            
            <div className="max-w-[1000px] mx-auto px-6 pb-20 relative z-10">
                <TopNav />

                {/* --- Profile Hero & Score --- */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-12 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Image
                                src={user.avatar_url}
                                alt={user.login}
                                width={120}
                                height={120}
                                className="rounded-full border-[3px] border-orange-500/80 shadow-[0_0_30px_rgba(255,140,0,0.15)]"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-[#050505] rounded-full p-1 border border-orange-500/50">
                                <div className="bg-orange-500/20 rounded-full w-8 h-8 flex items-center justify-center">
                                    <FlameIcon className="w-5 h-5 text-orange-500" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name || user.login}</h1>
                            <div className="text-lg text-muted-foreground mb-3">@{user.login}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Github className="w-4 h-4" /> 
                                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    github.com/{user.login}
                                </a>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Roasted on {formattedDate} <span className="mx-2">•</span> Roast ID: GR-{(Math.random() * 100000).toFixed(0).padStart(5, '0')}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end w-full md:w-auto">
                        <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">Seriousness Score</div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-6xl font-bold text-orange-500 tracking-tighter">{invertedScore}</span>
                            <span className="text-2xl text-muted-foreground">/ 1000</span>
                        </div>
                        <div className="w-full md:w-48 mb-4">
                            <SegmentedProgressBar score={invertedScore} />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 px-4 py-1.5 rounded-full">
                            <FlameIcon className="w-4 h-4" /> {badgeText}
                        </div>
                    </div>
                </section>

                {/* --- Primary Actions --- */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-16">
                    <ShareableCardDialog result={result} />
                    
                    <Button variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 h-10 px-5 rounded-lg shadow-none">
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 h-10 px-5 rounded-lg shadow-none">
                        <Download className="mr-2 h-4 w-4" /> Download Card
                    </Button>
                    <Button asChild variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 h-10 px-5 rounded-lg shadow-none">
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" /> View on GitHub
                        </a>
                    </Button>
                </div>

                {/* --- The Roast Card --- */}
                <div className="bg-[#0A0A0A] border border-orange-500/20 rounded-xl p-8 mb-8 relative shadow-[0_0_40px_rgba(255,140,0,0.03)] group hover:border-orange-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase">
                            <FlameIcon className="w-4 h-4" /> The Roast
                        </div>
                        <Quote className="w-8 h-8 text-orange-500/40" />
                    </div>
                    
                    <div className="border-l-[3px] border-orange-500 pl-6 space-y-6 mb-8">
                        {roastLines.map((line, index) => (
                            <p key={index} className="text-[22px] leading-relaxed text-white/90 font-serif italic">
                                {line}
                            </p>
                        ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground/60">
                        Generated from public GitHub activity
                    </div>
                </div>

                {/* --- Split Cards: Quick Wins & Profile Analysis --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    {/* Quick Wins */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-1">
                            <Zap className="w-4 h-4" /> Quick Wins
                        </div>
                        <div className="text-sm text-muted-foreground mb-6">Easy ways to boost your score.</div>
                        
                        <div className="space-y-4 mb-6">
                            {wins.map((win, idx) => (
                                <div key={win.id} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                                        0{idx + 1}
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                        {win.title}
                                    </div>
                                    <div className="text-[10px] font-bold text-green-400 bg-[#111] border border-green-500/20 px-2 py-1 rounded-full">
                                        +{win.pointsGain} pts
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Link href="/" className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                            View all suggestions <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Profile Analysis */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-1">
                                <UserIcon className="w-4 h-4" /> Profile Analysis
                            </div>
                            <div className="text-sm text-muted-foreground mb-6">Your GitHub personality</div>
                            
                            {archetype && (
                                <div>
                                    <h3 className="text-2xl font-bold text-orange-500 mb-3">{archetype.type}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{archetype.description}</p>
                                </div>
                            )}
                        </div>
                        
                        {archetype && (
                            <div className="md:w-[200px] border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                <h4 className="text-[10px] font-bold tracking-[0.2em] text-orange-500/70 uppercase mb-4">Common Traits</h4>
                                <ul className="space-y-4">
                                    {archetype.characteristics.map((trait, index) => (
                                        <li key={index} className="flex items-start gap-3 text-xs text-white/80">
                                            <div className="mt-0.5 rounded-sm border border-green-500/50 bg-green-500/10 p-0.5 shrink-0">
                                                <Check className="w-3 h-3 text-green-500" />
                                            </div>
                                            <span className="leading-snug">{trait}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Stats At a Glance --- */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8 mb-6 flex flex-col md:flex-row justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-8">
                            <Activity className="w-4 h-4" /> Stats At A Glance
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{totalStars ?? 0}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Stars Received</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{user.followers}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{user.following}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Following</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{user.public_repos}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Public Repos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{totalContributions}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Commits<br/>(year)</div>
                            </div>
                        </div>
                    </div>
                    
                    {topLanguages && topLanguages.length > 0 && (
                        <div className="md:w-[280px]">
                             <h3 className="text-[10px] font-bold tracking-[0.2em] text-orange-500/70 uppercase mb-5">Top Languages</h3>
                             <div className="flex flex-wrap gap-2">
                                {topLanguages.map(([language]) => (
                                    <span key={language} className="text-[11px] font-medium text-white/80 bg-[#111] px-3 py-1.5 rounded-full border border-white/5">
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Score Breakdown --- */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8 mb-12">
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-1">
                        <Trophy className="w-4 h-4" /> Score Breakdown
                    </div>
                    <div className="text-sm text-muted-foreground mb-8">How your GitHub activity adds up.</div>
                    
                    <div className="space-y-1">
                        {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => (
                            <ScoreRow key={key} category={key} data={breakdown[key]} />
                        ))}
                    </div>
                </div>

                {/* --- Bottom Navigation & Footer --- */}
                <div className="flex flex-col items-center justify-center pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-12">
                        <Button asChild variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 h-11 px-6 rounded-lg shadow-none">
                            <Link href={`/?username=${user.login}`}>
                                <FlameIcon className="mr-2 h-4 w-4 text-orange-500" /> Roast Another Developer
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 h-11 px-6 rounded-lg shadow-none">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" /> Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="w-full flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <FlameIcon className="w-4 h-4 text-orange-500" />
                            GitRoasted — Turning GitHub activity into comedy since 2024.
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white"><Github className="w-4 h-4" /></a>
                            <a href="#" className="hover:text-white"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
                            <a href="#" className="hover:text-white"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path></svg></a>
                        </div>
                    </div>
                </div>

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
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
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
             <Button asChild variant="outline" className="bg-[#111] border-white/10 hover:bg-white/5 text-white">
                <Link href={username ? `/?username=${username}` : '/'}>
                    Home
                </Link>
            </Button>
        </div>
    );
  }

  return <DashboardContent result={result} wins={wins} />;
}
