
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
import { RadarComparison } from './RadarComparison'
import { ShareComparison } from './ShareComparison'

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

  const seriousnessScore = user.score || 0;

  return (
    <div className={cn(
        "relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-xl",
        "user-score-card",
        position,
        isWinner ? 'winner' : ''
    )}>
      <div className="avatar-section">
        <Image
          src={user.user.avatar_url}
          alt={user.user.login}
          width={100}
          height={100}
          className={cn('rounded-full border-4 shadow-lg mb-4')}
        />
        {isWinner && <div className="crown">👑</div>}
      </div>
      <h3 className="text-2xl font-bold">{user.user.name || user.user.login}</h3>
      <a href={`https://github.com/${user.user.login}`} target="_blank" rel="noopener noreferrer" className="text-base text-muted-foreground hover:text-primary transition-colors">@{user.user.login}</a>
      <div className="score-display">
        <div className="score-number">
            <AnimatedNumber value={seriousnessScore} />
        </div>
        <div className="score-label">/ 1000</div>
      </div>
      {isWinner && <div className="winner-badge">WINNER</div>}
    </div>
  )
}

function CategoryComparison({ user1, user2 }: { user1: RoastResultState, user2: RoastResultState }) {
    if (user1.status !== 'success' || user2.status !== 'success' || !user1.breakdown || !user2.breakdown) return null;
    
    const categories = Object.keys(breakdownMeta) as Array<keyof typeof breakdownMeta>;

    return (
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 category-comparison">
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
                        <div key={key} className="category-row">
                             <div className={cn('score-bar left', winner === 'user1' && 'leading')}>
                                 <span className="score-value">{score1}</span>
                                <div 
                                    className="bar-fill"
                                    style={{ width: `${percentage1}%` }}
                                />
                            </div>

                            <div className="category-name">
                                <span>{category.label}</span>
                                <span className="max-score text-sm text-muted-foreground block">/ {category.maxScore}</span>
                                {winner !== 'tie' && (
                                     <span className={cn('lead-indicator', winner === 'user1' ? 'left' : 'right')}>
                                        +{diff}
                                    </span>
                                )}
                            </div>

                            <div className={cn('score-bar right', winner === 'user2' && 'leading')}>
                                <div 
                                    className="bar-fill"
                                    style={{ width: `${percentage2}%` }}
                                />
                                <span className="score-value">{score2}</span>
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

  const score1 = user1Data.score;
  const score2 = user2Data.score;
  
  const winner = score1 > score2 ? user1Data : user2Data;
  const winnerUsername = winner.user?.name || winner.username;
  const scoreDiff = Math.abs(score1 - score2);

  const currentUser = user1Data;
  const opponent = user2Data;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in-0 duration-500 comparison-dashboard">
      <header className="winner-banner">
        <h2>🏆 {winnerUsername} wins!</h2>
        <p>
          Winning by a margin of {scoreDiff} points. Here's how it all went down.
        </p>
      </header>
      
      <div className="score-overview">
        <UserScoreCard user={user1Data} isWinner={score1 > score2} position="left" />
        <div className="vs-indicator">
            <div className="score-diff">
                {scoreDiff} pts
                <span>difference</span>
            </div>
        </div>
        <UserScoreCard user={user2Data} isWinner={score2 > score1} position="right" />
      </div>

      <CategoryComparison user1={user1Data} user2={user2Data} />
      
      <RadarComparison user1={user1Data} user2={user2Data} />

      <StrengthsWeaknesses user1={user1Data} user2={user2Data} currentUser={user1Data.username!} />

      <ImprovementRoadmap currentUser={currentUser} opponent={opponent} />
      
      <ProjectRecommendations currentUser={currentUser} opponent={opponent} />

      <ShareComparison user1={user1Data} user2={user2Data} winner={winner} />

    </div>
  );
}
