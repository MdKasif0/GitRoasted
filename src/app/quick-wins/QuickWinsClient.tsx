'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  Tag, 
  Flame, 
  Zap, 
  User, 
  GitBranch, 
  Languages, 
  Users,
  ExternalLink,
  Check
} from 'lucide-react';

import { calculateQuickWins } from '@/lib/quickWins';
import type { RoastResultState, QuickWin, GitHubUser } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/AnimatedNumber';

const iconMap: Record<string, React.ElementType> = {
  'add-readme': BookOpen,
  'add-bio': User,
  'add-topics': Tag,
  'add-license': BookOpen,
  'build-streak': Flame,
  'increase-activity': Zap,
  'complete-profile': User,
  'add-ci': GitBranch,
  'learn-languages': Languages,
  'improve-ratio': Users,
};

const categoryMap: Record<string, string> = {
  'add-readme': 'Documentation',
  'add-bio': 'Profile',
  'add-topics': 'Discoverability',
  'add-license': 'Legal',
  'build-streak': 'Consistency',
  'increase-activity': 'Activity',
  'complete-profile': 'Profile',
  'add-ci': 'Best Practices',
  'learn-languages': 'Versatility',
  'improve-ratio': 'Community',
};

const difficultyConfig: Record<string, { label: string; textClass: string; dotClass: string }> = {
  easy: {
    label: 'Easy',
    textClass: 'text-emerald-400',
    dotClass: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    textClass: 'text-amber-400',
    dotClass: 'bg-amber-400',
  },
  hard: {
    label: 'Hard',
    textClass: 'text-rose-400',
    dotClass: 'bg-rose-400',
  },
};

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

function QuickWinCard({ win, index }: { win: QuickWin; index: number }) {
  const Icon = iconMap[win.id] || win.icon || Lightbulb;
  const category = categoryMap[win.id] || 'Improvement';
  const progress = Math.min(100, Math.max(0, win.progress || 0));
  const diff = difficultyConfig[win.difficulty] || difficultyConfig.easy;
  const indexFormatted = String(index + 1).padStart(2, '0');

  return (
    <div className="bg-[#0A0A0A] border border-white/[0.08] hover:border-orange-500/30 rounded-xl p-5 md:p-6 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
      <div>
        {/* Top Header Row: Task Number + Category Icon/Label + Point Reward */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-muted-foreground/50 font-medium">
              {indexFormatted}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-orange-400 uppercase">
              <Icon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{category}</span>
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded shrink-0">
            +{win.pointsGain} pts
          </div>
        </div>

        {/* Title & Description (Left-aligned, crisp) */}
        <h3 className="text-base md:text-lg font-semibold text-[#F5F5F5] group-hover:text-white transition-colors leading-snug mb-1.5 text-left">
          {win.title}
        </h3>
        <p className="text-xs md:text-sm text-[#8B949E] line-clamp-2 leading-relaxed text-left mb-5">
          {win.description}
        </p>
      </div>

      <div>
        {/* Progress Section */}
        <div className="pt-3 border-t border-white/5 mb-5">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-muted-foreground font-medium">{win.progressLabel || 'Progress'}</span>
            <span className="font-mono font-semibold text-white/90">{win.progressValue || `${Math.round(progress)}%`}</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Bottom Row: Difficulty + Time Estimate + Action Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-mono uppercase text-[11px] font-semibold">
              <span className={cn("w-1.5 h-1.5 rounded-full", diff.dotClass)} />
              <span className={diff.textClass}>{diff.label}</span>
            </div>
            {win.timeEstimate && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-muted-foreground/70 text-[11px] truncate max-w-[120px] sm:max-w-none">
                  {win.timeEstimate}
                </span>
              </>
            )}
          </div>

          {win.completed ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </div>
          ) : win.actionUrl ? (
            <Button 
              asChild 
              className="bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs h-8 px-3.5 rounded-lg flex items-center gap-1 shadow-none transition-all hover:-translate-y-0.5 shrink-0"
            >
              <a href={win.actionUrl} target="_blank" rel="noopener noreferrer">
                Complete <ArrowRight className="w-3 h-3 ml-0.5" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function QuickWinsContent({ user, initialWins, initialScore }: { user: GitHubUser; initialWins: QuickWin[]; initialScore: number }) {
  const [wins] = useState<QuickWin[]>(initialWins);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Difficulty>('all');

  useEffect(() => {
    const total = initialWins.reduce((sum, win) => sum + win.pointsGain, 0);
    setTotalPoints(total);
  }, [initialWins]);

  const potentialScore = Math.min(1000, Math.round(initialScore + totalPoints));
  const progressPercentage = potentialScore > 0 ? (initialScore / potentialScore) * 100 : 0;

  const filteredWins = activeFilter === 'all'
    ? wins
    : wins.filter(win => win.difficulty === activeFilter);
  
  const difficultyCounts = initialWins.reduce((acc, win) => {
    acc[win.difficulty] = (acc[win.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<'easy' | 'medium' | 'hard', number>);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {/* Minimal Navigation Header */}
        <header className="w-full flex items-center justify-between pb-6 border-b border-white/5 mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Flame className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-tight text-white">GitRoasted</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="bg-[#111] border-white/10 text-xs text-muted-foreground hover:text-white hover:bg-white/5 h-8 px-3 rounded-lg shadow-none">
              <Link href={`/dashboard?username=${user.login}`} className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Roast
              </Link>
            </Button>
          </div>
        </header>

        {/* Profile Context & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative shrink-0">
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={64}
                  height={64}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-orange-500/60 object-cover"
                />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {user.name || user.login}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <a 
                    href={`https://github.com/${user.login}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    @{user.login}
                  </a>
                  <span>•</span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-medium">Action Plan</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Quick Wins
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Turn small GitHub improvements into a bigger developer score.
            </p>
          </div>
        </div>

        {/* Score Progression Panel */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            {/* Current Score */}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
                Current Score
              </span>
              <div className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                <AnimatedNumber value={Math.round(initialScore)} />
              </div>
              <span className="text-xs text-muted-foreground/60 mt-1 font-mono">out of 1000</span>
            </div>

            {/* Progression Connector */}
            <div className="flex flex-col items-center justify-center my-2 md:my-0">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 md:w-16 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <span>+{totalPoints} pts</span>
                </div>
                <div className="h-px w-8 md:w-16 bg-white/10 hidden sm:block" />
              </div>
              <span className="text-[11px] text-muted-foreground/60 mt-1.5">
                Potential Gain
              </span>
            </div>

            {/* Potential Score */}
            <div className="flex flex-col md:items-end">
              <span className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
                Potential Score
              </span>
              <div className="text-4xl md:text-5xl font-bold text-orange-500 tracking-tight font-mono">
                <AnimatedNumber value={potentialScore} />
              </div>
              <span className="text-xs text-muted-foreground/60 mt-1 font-mono">+{totalPoints} points available</span>
            </div>
          </div>

          {/* Progress Bar & Subtitle */}
          <div className="pt-6">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
              <span>Score headroom</span>
              <span className="font-mono">{Math.round(progressPercentage)}% of potential</span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>

            {/* Metadata Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-medium text-white/90">{initialWins.length} Quick Wins Available</span>
                <span className="text-white/20">•</span>
                <span>Complete tasks to gain +{totalPoints} points</span>
              </div>
              <div className="font-mono text-muted-foreground/70">
                Est. 2-3 weeks to complete
              </div>
            </div>
          </div>
        </div>

        {/* Action List Section Header & Segmented Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Your Quick Wins
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Small changes. A bigger GitHub score.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-[#0A0A0A] border border-white/10 rounded-lg self-start sm:self-auto">
            {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => {
              const count = difficulty === 'all' ? initialWins.length : (difficultyCounts[difficulty as 'easy'|'medium'|'hard'] || 0);
              if (count === 0 && difficulty !== 'all') return null;
              const isSelected = activeFilter === difficulty;
              return (
                <button
                  key={difficulty}
                  onClick={() => setActiveFilter(difficulty)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-all h-7",
                    isSelected 
                      ? "bg-orange-500 text-black font-bold shadow-sm" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <span>{difficulty}</span>
                  <span className={cn(
                    "text-[10px] font-mono px-1 py-0.2 rounded",
                    isSelected ? "bg-black/20 text-black" : "bg-white/10 text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Wins 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mb-12">
          {filteredWins.map((win, index) => (
            <QuickWinCard key={win.id} win={win} index={index} />
          ))}
        </div>

        {/* Empty Filter State */}
        {filteredWins.length === 0 && (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-12 text-center my-8">
            <CheckCircle2 className="mx-auto w-10 h-10 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">All {activeFilter} wins completed!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Great job! Switch to another category to view more opportunities.
            </p>
            <Button 
              onClick={() => setActiveFilter('all')} 
              variant="outline" 
              className="bg-[#111] border-white/10 text-white hover:bg-white/5 text-xs h-8 px-4"
            >
              View all Quick Wins
            </Button>
          </div>
        )}

        {/* Compact Conclusion / Completion Summary */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-1">
              Your Next Move
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              Ready to level up your developer profile?
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete these {initialWins.length} quick wins to gain +{totalPoints} points on your GitRoasted score.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button asChild variant="outline" className="flex-1 md:flex-initial bg-[#111] border-white/10 text-white hover:bg-white/5 h-10 px-5 rounded-lg text-xs font-medium shadow-none">
              <Link href="/">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Home
              </Link>
            </Button>
            <Button asChild className="flex-1 md:flex-initial bg-orange-500 hover:bg-orange-400 text-black font-semibold h-10 px-5 rounded-lg text-xs shadow-none">
              <Link href={`/dashboard?username=${user.login}`}>
                Back to Roast <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="text-center text-xs text-muted-foreground/50 py-8 border-t border-white/5">
          <p>GitRoasted — Roast your GitHub. Improve your craft.</p>
        </footer>
      </div>
    </div>
  );
}

export function QuickWinsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('username');

  const [wins, setWins] = useState<QuickWin[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided. Please go back and roast a user first.');
      return;
    }

    try {
      const cachedDataString = localStorage.getItem(`gitroasted_data_${username.toLowerCase()}`);
      if (!cachedDataString) {
        setError(`No roast data found for "${username}". Please go back and roast this user to see their Quick Wins.`);
        return;
      }

      const userData: RoastResultState = JSON.parse(cachedDataString);

      if (userData.status !== 'success' || !userData.user) {
        setError(`Could not load Quick Wins. The last roast for "${username}" was not successful.`);
        return;
      }

      const quickWins = calculateQuickWins(userData);
      const invertedScore = 1000 - (userData.score || 0);

      setWins(quickWins);
      setCurrentScore(invertedScore);
      setUser(userData.user);
    } catch (e) {
      console.error("Failed to load or parse data for Quick Wins", e);
      setError("An error occurred while loading the Quick Wins data.");
    }
  }, [username, router]);

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 gap-4">
        <Alert variant="destructive" className="max-w-lg bg-[#0A0A0A] border-red-500/20 text-white">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400 font-bold">Could Not Load Quick Wins</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground mt-1">
            {error || 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="bg-[#111] border-white/10 text-white hover:bg-white/5 text-xs">
          <Link href={username ? `/?username=${username}` : '/'}>
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return <QuickWinsContent user={user} initialWins={wins} initialScore={currentScore} />;
}
