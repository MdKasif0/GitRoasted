// src/components/LoadingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { FlameIcon, XIcon } from './icons';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface LoadingModalProps {
  username: string;
}

const steps = [
  'Fetching public data...',
  'Analyzing repositories...',
  'Counting stars & forks...',
  'Calculating commit frequency...',
  'Generating your roast...',
];

const funFacts = [
    'The most committed day on GitHub is Tuesday.',
    'The most popular programming language on GitHub is JavaScript.',
    'The first-ever commit on GitHub was made on October 19, 2007.',
    'Over 100 million developers use GitHub.',
    'The GitHub mascot is an Octocat named Mona.'
];

export function LoadingModal({ username }: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [funFact, setFunFact] = useState('');
  
  useEffect(() => {
     setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // Fast animation for a smooth progress feel

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepToShow = Math.floor(progress / (100 / steps.length));
    setCurrentStep(stepToShow);
  }, [progress]);

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-md m-4 bg-gray-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">
        
        <header className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <FlameIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-lg font-medium">
                Fetching profile: <span className="text-primary font-bold">@{username}</span>
            </h2>
             <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white h-8 w-8">
                <XIcon className="w-5 h-5" />
                <span className="sr-only">Close</span>
            </Button>
        </header>

        <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8"/>
                <circle
                    cx="60"
                    cy="60"
                    r="56"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transform -rotate-90 origin-center transition-all duration-300 ease-linear"
                />
                <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold">{progress}%</p>
                <p className="text-muted-foreground text-sm mt-1">Loading...</p>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 text-lg">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                       {index < currentStep && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                       {index === currentStep && (
                           <div className="w-5 h-5 rounded-full bg-primary animate-pulse glow"></div>
                       )}
                       {index > currentStep && <div className="w-5 h-5 rounded-full bg-white/20 border-2 border-white/30"></div>}
                       
                       {index < steps.length -1 && <div className={cn("absolute h-full w-0.5 top-6 left-1/2 -translate-x-1/2", 
                        index < currentStep ? "bg-green-500" : "bg-white/20"
                       )}></div>}

                    </div>
                    <span className={cn("font-medium", index > currentStep ? "text-muted-foreground/60" : "text-foreground")}>{step}</span>
                </div>
            ))}
        </div>

        <footer className="text-center text-sm text-muted-foreground">
            <p><span className='font-bold text-primary'>Fun Fact:</span> {funFact}</p>
        </footer>
      </div>
    </div>
  );
}
