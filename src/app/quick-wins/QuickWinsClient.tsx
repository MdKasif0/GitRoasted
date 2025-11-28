
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateQuickWins } from '@/lib/quickWins';
import type { RoastResultState, QuickWin, GitHubUser } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, ArrowRight, Lightbulb, RefreshCw, Star, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookOpen, Tag, Flame, Zap, User, GitBranch, Languages, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatedNumber } from '@/components/AnimatedNumber';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const iconMap: { [key: string]: React.ElementType } = {
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

const categoryMap: { [key: string]: string } = {
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


type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

function QuickWinCard({ win, index }: { win: QuickWin; index: number }) {
  const Icon = iconMap[win.id] || Lightbulb;
  const category = categoryMap[win.id] || 'General';
  
  const difficultyClasses = {
    easy: {
      badge: "bg-green-500/10 text-green-400 border-green-500/20",
      button: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    medium: {
      badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      button: "bg-gradient-to-r from-yellow-500 to-amber-500",
    },
    hard: {
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
      button: "bg-gradient-to-r from-red-500 to-rose-500",
    }
  };

  return (
    <div className="premium-border-container card-entrance" style={{ animationDelay: `${400 + index * 50}ms`}}>
      <div className="premium-card-content flex flex-col justify-between">
        <div className="w-full">
            <div className="flex justify-between items-start text-left mb-4">
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                    <Award className="w-3 h-3 mr-1.5" />
                    {category}
                </Badge>
            </div>
            
            <Icon className="w-12 h-12 text-primary/80 mx-auto mb-4" />
            
            <h3 className="text-xl font-bold text-slate-100 mb-2 text-center">{win.title}</h3>
            <p className="text-slate-400 text-sm text-center mb-6">{win.description}</p>
        </div>
        
        <div className="w-full space-y-5">
            <div>
              <Progress value={45} indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-slate-400">45% Completed</span>
                  <span className="font-bold text-primary">+{win.pointsGain} Points</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
                 <Badge className={cn("capitalize", difficultyClasses[win.difficulty].badge)}>
                    {win.difficulty}
                 </Badge>
                 <Button asChild className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg hover:shadow-yellow-400/30">
                    <a href={win.actionUrl} target="_blank" rel="noopener noreferrer">
                        Complete Win
                    </a>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

function QuickWinsContent({ user, initialWins, initialScore }: { user: GitHubUser, initialWins: QuickWin[], initialScore: number }) {
  const [wins, setWins] = useState<QuickWin[]>(initialWins);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Difficulty>('all');

  useEffect(() => {
    const total = initialWins.reduce((sum, win) => sum + win.pointsGain, 0);
    setTotalPoints(total);
  }, [initialWins]);

  const potentialScore = Math.min(1000, Math.round(initialScore + totalPoints));
  const progressPercentage = (initialScore / potentialScore) * 100;

  const filteredWins = activeFilter === 'all'
    ? wins
    : wins.filter(win => win.difficulty === activeFilter);
  
  const difficultyCounts = initialWins.reduce((acc, win) => {
    acc[win.difficulty] = (acc[win.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<'easy' | 'medium' | 'hard', number>);
  

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="relative mb-8 text-center animate-in fade-in-0 duration-500 scale-95" style={{animationName: 'slideInUp'}}>
        <Button asChild variant="ghost" className="absolute top-0 left-0 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20">
          <Link href={`/dashboard?username=${user.login}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        
        <div className="flex flex-col items-center">
            <div className="relative mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent animate-slow-spin"></div>
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={80}
                  height={80}
                  className="relative rounded-full border-4 border-slate-900"
                />
            </div>
            <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
            <p className="text-md text-slate-400">@{user.login}</p>
        </div>

        <div className="mt-8">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tighter gradient-text">
                Quick Wins
            </h1>
            <p className="text-lg text-slate-400 mt-2 max-w-xl mx-auto">
                Your personalized roadmap to level up your GitHub score.
            </p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="glass-card max-w-4xl mx-auto p-6 md:p-8 mb-12 card-entrance" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            {/* Current Score */}
            <div className='flex flex-col items-center justify-center'>
                <CardDescription className='text-slate-400'>Current Score</CardDescription>
                <div className='text-6xl font-bold text-slate-100'><AnimatedNumber value={Math.round(initialScore)} /></div>
            </div>
            {/* Arrow */}
            <div className="hidden md:block text-4xl text-slate-500 font-light mx-8">→</div>
            <div className='block md:hidden text-3xl text-slate-500 font-light rotate-90 mx-auto'>→</div>
            {/* Potential Score */}
            <div className='flex flex-col items-center justify-center'>
                <CardDescription className='text-slate-400'>Potential Score</CardDescription>
                <div className='text-6xl font-bold gradient-text'><AnimatedNumber value={potentialScore} /></div>
                <Badge className="mt-2 bg-green-500/10 text-green-300 border-green-500/20">🎯 +{totalPoints} pts</Badge>
            </div>
        </div>
        <div className="mt-8">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>{initialWins.length} Quick Wins Available</span>
                <span>Est. 2-3 weeks to complete</span>
            </div>
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 card-entrance" style={{ animationDelay: '300ms' }}>
        {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => {
            const count = difficulty === 'all' ? initialWins.length : (difficultyCounts[difficulty as 'easy'|'medium'|'hard'] || 0);
            if (count === 0 && difficulty !== 'all') return null;
            
            return (
              <Button 
                key={difficulty}
                onClick={() => setActiveFilter(difficulty)}
                variant="ghost"
                className={cn(
                    'capitalize rounded-full border border-transparent transition-all duration-300',
                    activeFilter === difficulty 
                        ? 'bg-primary text-primary-foreground border-primary/50' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                )}
              >
                {difficulty} <Badge variant="secondary" className="ml-2 bg-slate-600/50 text-slate-300">{count}</Badge>
              </Button>
            )
        })}
      </div>


      {/* Quick Wins List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredWins.map((win, index) => (
          <QuickWinCard key={win.id} win={win} index={index} />
        ))}
      </div>
       {filteredWins.length === 0 && activeFilter !== 'all' && (
           <div className="text-center py-16 col-span-full">
                <CheckCircle className="mx-auto w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold">All '{activeFilter}' wins completed!</h3>
                <p className="text-slate-400">Great job! Try another category.</p>
           </div>
       )}

      {/* Bottom CTA */}
      <div className="text-center mt-16 max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800/50 border border-slate-700">
        <h3 className="text-2xl font-bold">Ready to level up? 🚀</h3>
        <p className="text-slate-400 mt-2 mb-6">Complete these {initialWins.length} quick wins to gain +{totalPoints} points!</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/dashboard?username=${user.login}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/?username=${user.login}`}>
                Back to Roast <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </div>
      </div>
    </div>
  )
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

      const userData: RoastResultState & { timestamp?: number } = JSON.parse(cachedDataString);

      const isExpired = userData.timestamp && (Date.now() - userData.timestamp > CACHE_DURATION);
      if (isExpired) {
          localStorage.removeItem(`gitroasted_data_${username.toLowerCase()}`);
          setError(`The roast data for "${username}" is over 24 hours old. Please re-roast them for fresh tips.`);
          return;
      }

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
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Quick Wins</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred.'}
                </AlertDescription>
            </Alert>
             <Button asChild>
                <Link href={username ? `/?username=${username}` : '/'}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>
            </Button>
        </div>
    );
  }

  return <QuickWinsContent user={user} initialWins={wins} initialScore={currentScore} />;
}

    