// src/components/ScoreCircle.tsx
'use client';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './AnimatedNumber';

export function ScoreCircle({ value, indicatorClassName }: { value: number, indicatorClassName?: string }) {
    const circumference = 2 * Math.PI * 56; // 2 * pi * radius
    const strokeDashoffset = circumference * (1 - (value / 1000));

    return (
        <div className="relative my-6 flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
                 <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                </defs>
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    strokeWidth="8"
                    className="stroke-muted/20"
                    fill="transparent"
                />
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    strokeWidth="8"
                    stroke="url(#score-gradient)"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    style={{ strokeDashoffset: strokeDashoffset }}
                    strokeLinecap="round"
                    className="progress-circle"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-primary">
                  <AnimatedNumber value={Math.round(value)} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">/ 1000</div>
            </div>
        </div>
    );
}
