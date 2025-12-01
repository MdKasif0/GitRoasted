
'use client'

import type { RoastResultState } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { HardHat, Rocket, BookOpen, Star, BrainCircuit } from 'lucide-react';
import { analyzeGaps } from './StrengthsWeaknesses';

interface ProjectRecommendationsProps {
  currentUser: RoastResultState;
  opponent: RoastResultState;
}

interface Recommendation {
  icon: React.ElementType;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  benefits: string[];
  techStack: string[];
  pointsPotential: number;
  timeEstimate: string;
}

function generateProjectRecommendations(you: RoastResultState, them: RoastResultState): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (you.status !== 'success' || them.status !== 'success' || !you.username) return [];

    const analysis = analyzeGaps(you, them, you.username);
    const gaps = analysis.yourWeaknesses;

    if (gaps.some(w => w.category === 'Impact')) {
        recommendations.push({
            icon: Rocket,
            title: 'Developer Tool or CLI',
            description: 'Build a command-line tool that solves a common developer pain point. They often get shared and starred.',
            difficulty: 'Medium',
            benefits: ['High star potential', 'Showcases practical skills', 'Easy to market on dev forums'],
            techStack: ['Node.js', 'TypeScript', 'Commander.js'],
            pointsPotential: 50,
            timeEstimate: '2-3 weeks',
        });
    }

    if (gaps.some(w => w.category === 'Diversity')) {
        const yourLangs = new Set(you.repos?.map(r => r.language).filter(Boolean));
        const theirLangs = new Set(them.repos?.map(r => r.language).filter(Boolean));
        const missingLang = [...theirLangs].find(l => !yourLangs.has(l));
        
        recommendations.push({
            icon: BrainCircuit,
            title: `${missingLang || 'New Language'} Project`,
            description: `Build a small project in ${missingLang || 'a new language like Rust or Go'} to expand your tech stack.`,
            difficulty: 'Hard',
            benefits: ['Increases language diversity score', 'Makes you more versatile', 'Attracts different audiences'],
            techStack: [missingLang || 'Rust', 'WebAssembly', 'Testing Tools'],
            pointsPotential: 20,
            timeEstimate: '1 month',
        });
    }
    
    if (gaps.some(w => w.category === 'Community')) {
        recommendations.push({
            icon: BookOpen,
            title: 'Educational Content or Tutorial',
            description: 'Create a comprehensive guide or a "getting started" repository for a technology you know well.',
            difficulty: 'Easy',
            benefits: ['Attracts followers organically', 'Positions you as an expert', 'Easy to share on social media'],
            techStack: ['Markdown', 'GitHub Pages', 'Your Expertise'],
            pointsPotential: 15,
            timeEstimate: '1 week',
        });
    }
    
    if (recommendations.length < 3) {
      recommendations.push({
          icon: Star,
          title: 'Niche "Awesome List"',
          description: 'Curate a high-quality list of resources for a specific technology or topic you care about.',
          difficulty: 'Easy',
          benefits: ['Great for community building', 'High potential for stars and forks', 'Establishes credibility'],
          techStack: ['Markdown', 'Community Sourcing'],
          pointsPotential: 25,
          timeEstimate: '3-4 days',
      });
    }

    return recommendations.slice(0, 3);
}

export function ProjectRecommendations({ currentUser, opponent }: ProjectRecommendationsProps) {
  const recommendations = generateProjectRecommendations(currentUser, opponent);
  
  if (recommendations.length === 0) return null;

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-2xl">💡 Recommended Projects</CardTitle>
        <CardDescription>
          Build one of these projects to help close the score gap with @{opponent.username}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-primary/50 transition-all hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <rec.icon className="w-8 h-8 text-primary" />
                </div>
                <Badge className="capitalize" variant={
                    rec.difficulty === 'Easy' ? 'secondary' : rec.difficulty === 'Medium' ? 'default' : 'destructive'
                }>{rec.difficulty}</Badge>
              </div>

              <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
              
              <h4 className="font-semibold text-sm mb-2">Why this helps:</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mb-4">
                {rec.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div>
                <h4 className="font-semibold text-sm mb-2">Suggested stack:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {rec.techStack.map((tech, i) => (
                        <Badge key={i} variant="outline" className="border-purple-500/20">{tech}</Badge>
                    ))}
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t border-white/10">
                    <span>Potential: <span className="font-bold text-green-400">+{rec.pointsPotential} pts</span></span>
                    <span>Time: <span className="font-bold text-white">{rec.timeEstimate}</span></span>
                </div>
            </div>

          </div>
        ))}
      </CardContent>
    </Card>
  );
}
