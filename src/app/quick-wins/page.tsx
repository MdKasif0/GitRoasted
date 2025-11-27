'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateQuickWins } from '@/lib/quickWins';
import type { RoastResultState, QuickWin } from '@/lib/types';
import { QuickWinsClient } from './QuickWinsClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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

export default function QuickWinsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('username');

  const [wins, setWins] = useState<QuickWin[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided. Please go back and roast a user first.');
      setLoading(false);
      return;
    }

    try {
      const cachedDataString = localStorage.getItem(`gitroasted_data_${username.toLowerCase()}`);
      if (!cachedDataString) {
        setError(`No roast data found for "${username}". Please go back and roast this user to see their Quick Wins.`);
        setLoading(false);
        return;
      }

      const userData: RoastResultState & { timestamp?: number } = JSON.parse(cachedDataString);

      // Check for cache expiration
      const isExpired = userData.timestamp && (Date.now() - userData.timestamp > CACHE_DURATION);
      if (isExpired) {
          localStorage.removeItem(`gitroasted_data_${username.toLowerCase()}`);
          setError(`The roast data for "${username}" is over 24 hours old. Please re-roast them for fresh tips.`);
          setLoading(false);
          return;
      }

      if (userData.status !== 'success') {
          setError(`Could not load Quick Wins. The last roast for "${username}" was not successful.`);
          setLoading(false);
          return;
      }

      const quickWins = calculateQuickWins(userData);
      const invertedScore = 1000 - (userData.score || 0);

      setWins(quickWins);
      setCurrentScore(invertedScore);
    } catch (e) {
        console.error("Failed to load or parse data for Quick Wins", e);
        setError("An error occurred while loading the Quick Wins data.");
    } finally {
        setLoading(false);
    }
  }, [username, router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !username) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Quick Wins</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred.'}
                </AlertDescription>
            </Alert>
             <Button asChild>
                <Link href={username ? `/dashboard?username=${username}` : '/'}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
    );
  }

  return <QuickWinsClient username={username} initialWins={wins} initialScore={currentScore} />;
}
