// src/components/ScoreCircle.tsx
'use client';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './AnimatedNumber';

export function ScoreCircle({ value, indicatorClassName }: { value: number, indicatorClassName?: string }) {
    const percentage = value / 10; // score is out of 1000, we want it out of 100
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const strokeDashoffset = circumference * (1 - (value / 1000));

    return (
        <div className="relative my-6">
            <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
                <circle
                    cx="60"
                    cy="60"
                    r="52"
                    strokeWidth="10"
                    className="stroke-muted/30"
                    fill="transparent"
                />
                <circle
                    cx="60"
                    cy="60"
                    r="52"
                    strokeWidth="10"
                    className={cn("progress-circle glow", indicatorClassName || 'stroke-primary')}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    style={{ strokeDashoffset: strokeDashoffset }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-primary" style={{'--num': value} as React.CSSProperties}>
                  <AnimatedNumber value={Math.round(value)} />
                </div>
                <div className="text-sm text-muted-foreground">Seriousness Score</div>
            </div>
        </div>
    );
}

    