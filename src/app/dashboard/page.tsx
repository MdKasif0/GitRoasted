
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateQuickWins } from '@/lib/quickWins';
import type { RoastResultState, QuickWin } from '@/lib/types';
import { DashboardClient } from './DashboardClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function LoadingSkeleton() {
    return (
        <div className="min-h-screen w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
            <div className="h-12 w-96 bg-muted rounded-md mb-2"></div>
            <div className="h-6 w-80 bg-muted rounded-md mb-12"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1 space-y-8">
                     <div className="h-[500px] bg-muted rounded-lg"></div>
                </aside>
                <main className="lg:col-span-2 space-y-8">
                    <div className="h-48 bg-muted rounded-lg"></div>
                    <div className="h-64 bg-muted rounded-lg"></div>
                    <div className="h-96 bg-muted rounded-lg"></div>
                </main>
            </div>
        </div>
    )
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [result, setResult] = useState<RoastResultState | null>(null);
  const [wins, setWins] = useState<QuickWin[]>([]);
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
        setError(`No roast data found for "${username}". Please go back and roast this user to see their Dashboard.`);
        setLoading(false);
        return;
      }

      const userData: RoastResultState & { timestamp?: number } = JSON.parse(cachedDataString);

      const isExpired = userData.timestamp && (Date.now() - userData.timestamp > CACHE_DURATION);
      if (isExpired) {
          localStorage.removeItem(`gitroasted_data_${username.toLowerCase()}`);
          setError(`The roast data for "${username}" is over 24 hours old. Please re-roast them for a fresh analysis.`);
          setLoading(false);
          return;
      }

      if (userData.status !== 'success') {
          setError(`Could not load Dashboard. The last roast for "${username}" was not successful.`);
          setLoading(false);
          return;
      }

      const quickWins = calculateQuickWins(userData);
      setResult(userData);
      setWins(quickWins);
    } catch (e) {
        console.error("Failed to load or parse data for Dashboard", e);
        setError("An error occurred while loading the Dashboard data.");
    } finally {
        setLoading(false);
    }
  }, [username]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !result) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Dashboard</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred.'}
                </AlertDescription>
            </Alert>
             <Button asChild>
                <Link href={username ? `/?username=${username}` : '/'}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Roast
                </Link>
            </Button>
        </div>
    );
  }

  return <DashboardClient result={result} wins={wins} />;
}
