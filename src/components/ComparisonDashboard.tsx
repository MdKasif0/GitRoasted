
'use client'

import type { RoastResultState, ScoreBreakdown } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Crown, Trophy, Package, Calendar, GitCommit, Heart, Code, Milestone, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedNumber } from './AnimatedNumber'
import { Progress } from './ui/progress'
import { StrengthsWeaknesses } from './StrengthsWeaknesses'
import { ImprovementRoadmap } from './ImprovementRoadmap'
import { ProjectRecommendations } from './ProjectRecommendations'

interface ComparisonDashboardProps {
  user1Data: RoastResultState
  user2Data: RoastResultState
}

const breakdownMeta: Record<keyof Omit<ScoreBreakdown, 'specialBonus'>, { label: string; icon: React.ElementType, maxScore: number }> = {
    impact: { label: 'Impact', icon: Package, maxScore: 250 },
    consistency: { label: 'Consistency', icon: Calendar, maxScore: 200 },
    quality: { label: 'Quality', icon: GitCommit, maxScore: 150 },
    community: { label: 'Community', icon: Heart, maxScore: 150 },
    diversity: { label: 'Diversity', icon: Code, maxScore: 100 },
    experience: { label: 'Experience', icon: Milestone, maxScore: 75 },
    activity: { label: 'Activity', icon: Zap, maxScore: 50 },
}

function UserScoreCard({ user, isWinner, position }: { user: RoastResultState, isWinner: boolean, position: 'left' | 'right' }) {
  if (user.status !== 'success' || !user.user || typeof user.score === 'undefined') return null;

  const invertedScore = 1000 - (user.score || 0);

  return (
    <div className={cn(
        "relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-xl",
        isWinner ? 'border-primary/60 shadow-primary/20 shadow-2xl z-10 scale-105' : 'border-white/10'
    )}>
      {isWinner && (
        <>
            <Crown className="absolute -top-4 w-8 h-8 text-primary -rotate-12" />
            <div className="absolute top-2 right-2 px-3 py-1 text-xs font-bold text-background bg-primary rounded-full">WINNER</div>
        </>
      )}
      <Image
        src={user.user.avatar_url}
        alt={user.user.login}
        width={100}
        height={100}
        className={cn('rounded-full border-4 shadow-lg mb-4', isWinner ? 'border-primary' : 'border-white/20')}
      />
      <h3 className="text-2xl font-bold">{user.user.name || user.user.login}</h3>
      <a href={`https://github.com/${user.user.login}`} target="_blank" rel="noopener noreferrer" className="text-base text-muted-foreground hover:text-primary transition-colors">@{user.user.login}</a>
      <div className="mt-4 text-5xl font-bold text-primary flex items-baseline justify-center gap-1">
        <AnimatedNumber value={invertedScore} />
        <span className="text-2xl text-muted-foreground">/ 1000</span>
      </div>
    </div>
  )
}

function CategoryComparison({ user1, user2 }: { user1: RoastResultState, user2: RoastResultState }) {
    if (user1.status !== 'success' || user2.status !== 'success' || !user1.breakdown || !user2.breakdown) return null;
    
    const categories = Object.keys(breakdownMeta) as Array<keyof typeof breakdownMeta>;
    const invertedScore1 = 1000 - (user1.score || 0);
    const invertedScore2 = 1000 - (user2.score || 0);

    return (
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="text-primary w-6 h-6" />
                    Category Breakdown
                </CardTitle>
                <CardDescription>A detailed look at who won each category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {categories.map(key => {
                    if (!user1.breakdown?.[key] || !user2.breakdown?.[key]) return null;
                    const category = breakdownMeta[key];
                    const score1 = user1.breakdown[key].total;
                    const score2 = user2.breakdown[key].total;
                    const winner = score1 > score2 ? 'user1' : (score2 > score1 ? 'user2' : 'tie');
                    const diff = Math.abs(score1 - score2);

                    const percentage1 = (score1 / category.maxScore) * 100;
                    const percentage2 = (score2 / category.maxScore) * 100;

                    return (
                        <div key={key} className="space-y-3">
                            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                                <div className="font-bold text-lg">{category.label}</div>
                                <div className="text-sm text-muted-foreground">Max: {category.maxScore} pts</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                                {/* User 1 */}
                                <div className="w-full flex items-center gap-2">
                                    <div className="w-10 font-bold text-primary text-right">{score1}</div>
                                    <Progress value={percentage1} indicatorClassName={cn(winner === 'user1' && 'bg-gradient-to-r from-primary to-purple-500')} />
                                </div>

                                <div className="text-sm font-bold text-primary/80">
                                    {winner !== 'tie' ? `+${diff}` : 'Tie'}
                                </div>
                                
                                {/* User 2 */}
                                <div className="w-full flex items-center gap-2">
                                    <Progress value={percentage2} indicatorClassName={cn(winner === 'user2' && 'bg-gradient-to-r from-primary to-purple-500')} />
                                    <div className="w-10 font-bold text-primary">{score2}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 -mt-2">
                                <div className={cn('text-xs font-semibold text-left', winner === 'user1' ? 'text-primary' : 'text-muted-foreground')}>@{user1.username}</div>
                                <div></div>
                                <div className={cn('text-xs font-semibold text-right', winner === 'user2' ? 'text-primary' : 'text-muted-foreground')}>@{user2.username}</div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}

export function ComparisonDashboard({ user1Data, user2Data }: ComparisonDashboardProps) {
  if (user1Data.status !== 'success' || user2Data.status !== 'success' || !user1Data.score || !user2Data.score) {
    return <div>Error loading comparison data.</div>;
  }

  const invertedScore1 = 1000 - user1Data.score;
  const invertedScore2 = 1000 - user2Data.score;
  
  const winner = invertedScore1 > invertedScore2 ? 'user1' : 'user2';
  const winnerData = winner === 'user1' ? user1Data : user2Data;
  const scoreDiff = Math.abs(invertedScore1 - invertedScore2);

  const currentUser = user1Data;
  const opponent = user2Data;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter gradient-text">
          🏆 {winnerData.user?.name || winnerData.username} Wins!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
          Winning by a margin of {scoreDiff} points. Here's how it all went down.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <UserScoreCard user={user1Data} isWinner={winner === 'user1'} position="left" />
        <div className="text-4xl font-black text-primary/50 my-4 md:my-0">VS</div>
        <UserScoreCard user={user2Data} isWinner={winner === 'user2'} position="right" />
      </div>

      <CategoryComparison user1={user1Data} user2={user2Data} />
      
      <StrengthsWeaknesses user1={user1Data} user2={user2Data} currentUser={user1Data.username!} />

      <ImprovementRoadmap currentUser={currentUser} opponent={opponent} />
      
      <ProjectRecommendations currentUser={currentUser} opponent={opponent} />
    </div>
  );
}
