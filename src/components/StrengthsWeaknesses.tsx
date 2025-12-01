
'use client'

import type { RoastResultState, ScoreCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, AlertCircle, Lightbulb, BarChart, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';


interface StrengthsWeaknessesProps {
    user1: RoastResultState,
    user2: RoastResultState,
    currentUser: string, // The username of the user to analyze
}

interface AnalysisResult {
    category: string;
    yourScore: number;
    theirScore: number;
    difference: number;
    description: string;
    improvementHint?: string;
}

const categoryDisplayMap: Record<string, {name: string, strength: string, weakness: string}> = {
    impact: { name: 'Impact', strength: 'You have more popular projects.', weakness: 'Their projects have more stars.' },
    consistency: { name: 'Consistency', strength: 'You contribute more frequently.', weakness: 'They have a stronger contribution habit.' },
    quality: { name: 'Quality', strength: 'Your repos show higher quality signals.', weakness: 'Their code quality indicators are better.' },
    community: { name: 'Community', strength: 'You have a stronger community presence.', weakness: 'They are more engaged with the community.' },
    diversity: { name: 'Diversity', strength: 'You work with more technologies.', weakness: 'They have a more diverse skillset.' },
    experience: { name: 'Experience', strength: 'You are a more seasoned developer.', weakness: 'They have been on GitHub longer.' },
    activity: { name: 'Activity', strength: 'You have been more active recently.', weakness: 'They have more recent activity.' },
};

function getImprovementHint(category: keyof typeof categoryDisplayMap, you: RoastResultState, them: RoastResultState): string {
    const hints = {
      impact: `Focus on creating projects that solve a real problem and promote them well.`,
      consistency: `Try to contribute something every day, even if it's small, to build a streak.`,
      quality: `Add READMEs, licenses, and CI/CD workflows to your main projects.`,
      community: `Engage with others by opening issues, submitting PRs, and following interesting developers.`,
      diversity: `Learn a new language or framework and build a small project with it.`,
      experience: `Time is the key here. Keep building and contributing consistently.`,
      activity: `Make some new commits or open a pull request to boost your recent activity score.`
    };
    return hints[category] || 'Keep improving!';
}


function analyzeGaps(user1: RoastResultState, user2: RoastResultState, currentUserName: string) {
    const isUser1Current = user1.username === currentUserName;
    const you = isUser1Current ? user1 : user2;
    const them = isUser1Current ? user2 : user1;

    const yourStrengths: AnalysisResult[] = [];
    const yourWeaknesses: AnalysisResult[] = [];

    const categories = Object.keys(categoryDisplayMap) as Array<keyof typeof categoryDisplayMap>;

    categories.forEach(cat => {
        if (!you.breakdown?.[cat] || !them.breakdown?.[cat]) return;

        const yourScore = you.breakdown[cat].total;
        const theirScore = them.breakdown[cat].total;
        const diff = Math.abs(yourScore - theirScore);
        
        if (yourScore > theirScore) {
            yourStrengths.push({
                category: categoryDisplayMap[cat].name,
                yourScore,
                theirScore,
                difference: diff,
                description: categoryDisplayMap[cat].strength
            });
        } else if (theirScore > yourScore) {
            yourWeaknesses.push({
                category: categoryDisplayMap[cat].name,
                yourScore,
                theirScore,
                difference: diff,
                description: categoryDisplayMap[cat].weakness,
                improvementHint: getImprovementHint(cat, you, them)
            });
        }
    });

    const invertedYouScore = 1000 - (you.score || 0);
    const invertedThemScore = 1000 - (them.score || 0);
    const totalGap = invertedYouScore < invertedThemScore ? invertedThemScore - invertedYouScore : 0;
    
    // Simple estimation for time to catch up
    const categoriesBehind = yourWeaknesses.length;
    let estimatedTime = "N/A";
    if (categoriesBehind > 5) estimatedTime = "6+ Months";
    else if (categoriesBehind > 2) estimatedTime = "3-6 Months";
    else if (categoriesBehind > 0) estimatedTime = "1-3 Months";

    return {
        yourStrengths: yourStrengths.sort((a, b) => b.difference - a.difference),
        yourWeaknesses: yourWeaknesses.sort((a, b) => b.difference - a.difference),
        totalGap,
        categoriesBehind,
        estimatedTime
    };
}


export function StrengthsWeaknesses({ user1, user2, currentUser }: StrengthsWeaknessesProps) {
    if (user1.status !== 'success' || user2.status !== 'success' || !user1.username) {
        return null;
    }
    
    const analysis = analyzeGaps(user1, user2, currentUser);

    const themUsername = user1.username === currentUser ? user2.username : user1.username;

    return (
        <div className="space-y-8">
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <BarChart className="text-primary w-6 h-6" />
                        Strengths &amp; Weaknesses
                    </CardTitle>
                    <CardDescription>
                        A breakdown of where you excel and where you can improve against @{themUsername}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {/* Your Strengths */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-green-400">🌟 Where You Excel</h3>
                        {analysis.yourStrengths.length > 0 ? (
                            analysis.yourStrengths.map(strength => (
                                <AnalysisCard key={strength.category} item={strength} type="strength" />
                            ))
                        ) : <p className='text-center text-muted-foreground p-4'>No clear strengths in this matchup.</p>}
                    </div>

                    {/* Your Weaknesses */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-red-400">📈 Where to Improve</h3>
                         {analysis.yourWeaknesses.length > 0 ? (
                            analysis.yourWeaknesses.map(weakness => (
                                <AnalysisCard key={weakness.category} item={weakness} type="weakness" />
                            ))
                        ) : <p className='text-center text-muted-foreground p-4'>You're dominating this matchup!</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Gap Summary */}
            {analysis.totalGap > 0 && (
                <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Target className="text-primary w-6 h-6" />
                            The Gap
                        </CardTitle>
                        <CardDescription>Summary of what it takes to catch up.</CardDescription>
                    </CardHeader>
                     <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 p-4 rounded-lg">
                            <p className="text-4xl font-bold text-primary">{analysis.totalGap}</p>
                            <p className="text-sm text-muted-foreground">Points Behind</p>
                        </div>
                         <div className="bg-white/5 p-4 rounded-lg">
                            <p className="text-4xl font-bold text-primary">{analysis.categoriesBehind}<span className='text-xl text-muted-foreground'>/7</span></p>
                            <p className="text-sm text-muted-foreground">Categories Losing</p>
                        </div>
                         <div className="bg-white/5 p-4 rounded-lg">
                            <p className="text-4xl font-bold text-primary">{analysis.estimatedTime}</p>
                            <p className="text-sm text-muted-foreground">Est. Time to Catch Up</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

const AnalysisCard = ({ item, type }: { item: AnalysisResult, type: 'strength' | 'weakness'}) => (
    <div className={cn(
        "bg-white/5 p-4 rounded-lg border-l-4",
        type === 'strength' ? 'border-green-500' : 'border-red-500'
    )}>
        <div className="flex items-start gap-3">
            <div className={cn(type === 'strength' ? 'text-green-500' : 'text-red-500')}>
                {type === 'strength' ? <CheckCircle2 className="w-5 h-5 mt-1" /> : <AlertCircle className="w-5 h-5 mt-1" />}
            </div>
            <div className="flex-1">
                <h4 className="font-bold">{item.category}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                 <div className="flex items-center justify-between text-sm mt-2 bg-black/20 p-2 rounded-md">
                    <span className="font-semibold text-primary">You: {item.yourScore}</span>
                     <span className={cn(
                        "font-bold px-2 py-0.5 rounded-full text-xs",
                        type === 'strength' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    )}>
                        {type === 'strength' ? '+' : '-'}{item.difference}
                    </span>
                    <span className="text-muted-foreground">Them: {item.theirScore}</span>
                </div>
                 {type === 'weakness' && item.improvementHint && (
                    <div className="mt-3 flex items-start gap-2 text-xs p-2 bg-yellow-500/10 text-yellow-300 rounded-md border border-yellow-500/20">
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{item.improvementHint}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);
