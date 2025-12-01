
'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import type { RoastResultState } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RadarComparisonProps {
  user1: RoastResultState;
  user2: RoastResultState;
}

export function RadarComparison({ user1, user2 }: RadarComparisonProps) {
  if (user1.status !== 'success' || user2.status !== 'success' || !user1.breakdown || !user2.breakdown || !user1.username || !user2.username) {
    return null;
  }

  const data = [
    {
      category: 'Impact',
      [user1.username]: (user1.breakdown.impact.total / 250) * 100,
      [user2.username]: (user2.breakdown.impact.total / 250) * 100,
    },
    {
      category: 'Consistency',
      [user1.username]: (user1.breakdown.consistency.total / 200) * 100,
      [user2.username]: (user2.breakdown.consistency.total / 200) * 100,
    },
    {
      category: 'Quality',
      [user1.username]: (user1.breakdown.quality.total / 150) * 100,
      [user2.username]: (user2.breakdown.quality.total / 150) * 100,
    },
    {
      category: 'Community',
      [user1.username]: (user1.breakdown.community.total / 150) * 100,
      [user2.username]: (user2.breakdown.community.total / 150) * 100,
    },
    {
      category: 'Diversity',
      [user1.username]: (user1.breakdown.diversity.total / 100) * 100,
      [user2.username]: (user2.breakdown.diversity.total / 100) * 100,
    },
    {
      category: 'Experience',
      [user1.username]: (user1.breakdown.experience.total / 75) * 100,
      [user2.username]: (user2.breakdown.experience.total / 75) * 100,
    },
    {
      category: 'Activity',
      [user1.username]: (user1.breakdown.activity.total / 50) * 100,
      [user2.username]: (user2.breakdown.activity.total / 50) * 100,
    }
  ];

  return (
    <Card className="radar-comparison bg-black/20 backdrop-blur-lg border-purple-500/30">
        <CardHeader>
            <CardTitle className="text-2xl">📊 Visual Comparison</CardTitle>
            <CardDescription>A visual representation of each user's strengths.</CardDescription>
        </CardHeader>
      
      <CardContent className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis 
              dataKey="category" 
              stroke="#94A3B8"
              tick={{ fontSize: 14 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              stroke="#334155"
              tick={false}
              axisLine={false}
            />
            <Radar
              name={user1.username}
              dataKey={user1.username}
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name={user2.username}
              dataKey={user2.username}
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend wrapperStyle={{paddingTop: '20px'}}/>
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
