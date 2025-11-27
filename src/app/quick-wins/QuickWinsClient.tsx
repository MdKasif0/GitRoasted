
'use client'

import { useState } from 'react'
import type { QuickWin } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Tag, Flame, Zap, User, GitBranch, Languages, Users, Lightbulb } from 'lucide-react';

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
function QuickWinCard({ win, rank }: { win: QuickWin; rank: number }) {
  const difficultyColors = {
    easy: 'border-green-500/80 bg-green-500/10',
    medium: 'border-yellow-500/80 bg-yellow-500/10',
    hard: 'border-red-500/80 bg-red-500/10'
  }
  const Icon = iconMap[win.id] || Lightbulb;

  return (
    <Card className={`win-card ${difficultyColors[win.difficulty]} border-l-4 transition-transform hover:-translate-y-1`}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
             <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>{win.title}</CardTitle>
             <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <Badge variant="outline" className="capitalize">{win.difficulty}</Badge>
                <span>⏱️ {win.timeEstimate}</span>
             </div>
          </div>
          <div className="text-right">
              <div className="text-2xl font-bold text-green-400">+{win.pointsGain}</div>
              <div className="text-xs text-muted-foreground">points</div>
          </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{win.description}</p>
        {win.actionUrl && (
          <Button asChild size="sm">
            <a 
              href={win.actionUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="action-button"
            >
              Take Action <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
            <div className="h-8 w-64 bg-muted rounded-md mb-2"></div>
            <div className="h-6 w-96 bg-muted rounded-md mb-12"></div>
            <div className="grid md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg"></div>
                ))}
            </div>
        </div>
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
        <Button asChild variant="ghost" className="-ml-4 mb-4">
          <Link href={`/?username=${username}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        
        <div className="flex items-center gap-4">
            <Lightbulb className="w-10 h-10 text-primary" />
            <div>
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
                    Quick Wins for @{username}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                    Easy ways to boost your GitHub score.
                </p>
            </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 md:gap-8 mb-12 text-center">
        <Card className="bg-white/5">
          <CardHeader>
            <CardDescription>Current Score</CardDescription>
            <CardTitle className="text-5xl">{Math.round(initialScore)}</CardTitle>
          </CardHeader>
        </Card>
        
        <div className="hidden md:block text-5xl text-muted-foreground font-light">→</div>
        
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
          <QuickWinCard key={win.id} win={win} rank={index + 1} />
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
