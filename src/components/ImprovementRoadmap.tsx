
'use client';

import type { RoastResultState } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Tag, User, Flame, Zap, GitBranch, Star } from 'lucide-react';

interface RoadmapProps {
  currentUser: RoastResultState;
  opponent: RoastResultState;
}

interface RoadmapPhase {
  title: string;
  duration: string;
  goal: string;
  tasks: RoadmapTask[];
  expectedScore: number;
}

interface RoadmapTask {
  icon: React.ElementType;
  title: string;
  description: string;
  points: number;
}

function generateRoadmap(you: RoastResultState, them: RoastResultState): { phases: RoadmapPhase[], estimatedTime: string } {
  if (you.status !== 'success' || them.status !== 'success' || !you.score || !them.score) {
    return { phases: [], estimatedTime: 'N/A' };
  }

  const invertedYou = 1000 - you.score;
  const invertedThem = 1000 - them.score;
  let currentScore = invertedYou;

  const phases: RoadmapPhase[] = [];
  
  // Phase 1: Foundation (Quick Wins)
  const quickWinTasks: RoadmapTask[] = [];
  if (!you.user?.bio || you.user.bio.length < 20) {
    quickWinTasks.push({ icon: User, title: 'Write a descriptive bio', description: 'Helps people understand who you are.', points: 8 });
  }
  const reposWithoutTopics = you.repos?.filter(r => !r.topics || r.topics.length === 0).slice(0, 5) || [];
  if (reposWithoutTopics.length > 0) {
    quickWinTasks.push({ icon: Tag, title: `Add topics to ${reposWithoutTopics.length} repos`, description: 'Improves discoverability on GitHub.', points: reposWithoutTopics.length });
  }
  const reposWithoutReadme = you.repos?.filter(r => !r.description).slice(0, 2) || [];
  if (reposWithoutReadme.length > 0) {
     quickWinTasks.push({ icon: BookOpen, title: `Add READMEs to ${reposWithoutReadme.length} repos`, description: 'Good documentation is crucial.', points: reposWithoutReadme.length * 3 });
  }
  
  if (quickWinTasks.length > 0) {
    const phase1Points = quickWinTasks.reduce((sum, task) => sum + task.points, 0);
    currentScore += phase1Points;
    phases.push({
      title: 'Foundation (Quick Wins)',
      duration: 'Week 1-2',
      goal: 'Knock out easy improvements for fast points.',
      tasks: quickWinTasks,
      expectedScore: Math.round(Math.min(1000, currentScore)),
    });
  }

  // Phase 2: Momentum
  const phase2Tasks: RoadmapTask[] = [
    { icon: Flame, title: 'Build a 30-Day Contribution Streak', description: 'Commit at least once daily for 30 days straight.', points: 15 },
    { icon: Zap, title: 'Increase Monthly Activity', description: 'Aim for 50+ meaningful contributions this month.', points: 12 },
  ];
  const phase2Points = phase2Tasks.reduce((sum, task) => sum + task.points, 0);
  currentScore += phase2Points;
  phases.push({
    title: 'Build Momentum',
    duration: 'Month 1',
    goal: `Close the gap in Consistency and Activity.`,
    tasks: phase2Tasks,
    expectedScore: Math.round(Math.min(1000, currentScore)),
  });

  // Phase 3: Quality & Impact
  const phase3Tasks: RoadmapTask[] = [
      { icon: GitBranch, title: 'Add CI/CD to Top Projects', description: 'Set up GitHub Actions for your top 2 projects.', points: 10 },
      { icon: Star, title: 'Build a High-Impact Project', description: 'Create one high-quality project aimed at 100+ stars.', points: 30 },
  ];
  const phase3Points = phase3Tasks.reduce((sum, task) => sum + task.points, 0);
  currentScore += phase3Points;
   phases.push({
    title: 'Level Up Quality & Impact',
    duration: 'Month 2-3',
    goal: `Match @${them.username}'s project quality.`,
    tasks: phase3Tasks,
    expectedScore: Math.round(Math.min(1000, currentScore)),
  });

  return { phases, estimatedTime: '2-3 months' };
}


export function ImprovementRoadmap({ currentUser, opponent }: RoadmapProps) {
  if (currentUser.status !== 'success' || opponent.status !== 'success' || !currentUser.score || !opponent.score) return null;
  
  const invertedCurrentUserScore = 1000 - currentUser.score;
  const invertedOpponentScore = 1000 - opponent.score;

  if (invertedCurrentUserScore >= invertedOpponentScore) return null;

  const { phases, estimatedTime } = generateRoadmap(currentUser, opponent);

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-2xl">🗺️ Your Roadmap to Victory</CardTitle>
        <CardDescription>
          Follow this {estimatedTime} plan to surpass @{opponent.username}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {phases.map((phase, index) => (
          <div key={index} className="relative pl-8">
            <div className="absolute left-0 flex flex-col items-center h-full">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">{index + 1}</div>
              {index < phases.length - 1 && <div className="w-0.5 flex-1 bg-primary/50"></div>}
            </div>
            <div className="ml-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold">{phase.title}</h3>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">{phase.duration}</Badge>
              </div>
              <p className="text-muted-foreground mt-1 mb-4">{phase.goal}</p>
              
              <div className="space-y-3">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-start gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <task.icon className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0">
                      +{task.points} pts
                    </Badge>
                  </div>
                ))}
              </div>

               <div className="mt-4 text-sm font-semibold text-right text-primary">
                  Expected score after phase: <span className="font-bold text-lg">{phase.expectedScore}/1000</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
