
'use client'

import { useState } from 'react'
import type { QuickWin } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Tag, Flame, Zap, User, GitBranch, Languages, Users, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

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


// Individual Win Card Component
function QuickWinCard({ win }: { win: QuickWin; }) {
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

export function QuickWinsClient({ username, initialWins, initialScore }: { username: string, initialWins: QuickWin[], initialScore: number }) {
  const [wins, setWins] = useState<QuickWin[]>(initialWins)
  const [totalPoints, setTotalPoints] = useState(0)
  
  useState(() => {
    const total = initialWins.reduce((sum, win) => sum + win.pointsGain, 0)
    setTotalPoints(total)
  });

  const potentialScore = Math.min(1000, Math.round(initialScore + totalPoints));

  return (
    <div className="min-h-screen w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-12">
        <Button asChild variant="outline" className="mb-4 bg-white/5 border-white/10 md:w-auto w-10 h-10 p-0 md:px-4 md:py-2">
          <Link href={`/dashboard?username=${username}`}>
            <ArrowLeft className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Back to Dashboard</span>
          </Link>
        </Button>
        
        <div className="flex items-center gap-4">
            <Lightbulb className="w-10 h-10 text-primary" />
            <div>
                 <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
                    Quick Wins for @{username}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                    Easy ways to boost your GitHub score.
                </p>
            </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 md:gap-8 mb-12 text-center p-6 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-2xl border border-white/10">
        <Card className="bg-white/5">
          <CardHeader>
            <CardDescription>Current Score</CardDescription>
            <CardTitle className="text-5xl">{Math.round(initialScore)}</CardTitle>
          </CardHeader>
        </Card>
        
        <div className="hidden md:block text-5xl text-muted-foreground font-light">→</div>
        <div className='block md:hidden text-3xl text-muted-foreground font-light rotate-90 mx-auto'>→</div>
        
        <Card className="border-2 border-green-500/50 bg-green-500/10 text-green-400">
          <CardHeader>
            <CardDescription className="text-green-400/80">Potential Score</CardDescription>
            <CardTitle className="text-5xl">{potentialScore}</CardTitle>
            <CardContent className="p-0 pt-2">
                 <Badge className="bg-green-500 text-white">+{totalPoints} points</Badge>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Wins List */}
      <div className="grid md:grid-cols-2 gap-6">
        {wins.map((win, index) => (
          <QuickWinCard key={win.id} win={win} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold">Ready to improve?</h3>
        <p className="text-muted-foreground mt-2 mb-6">Complete these tasks to boost your score by {totalPoints} points!</p>
        <Button asChild size="lg">
          <Link href={`/?username=${username}`}>
            Back to Profile
          </Link>
        </Button>
      </div>
    </div>
  )
}
