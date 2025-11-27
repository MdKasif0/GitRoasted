
import { fetchComprehensiveGitHubData } from '@/lib/github';
import { calculateRoastScore } from '@/lib/scoring';
import { calculateQuickWins } from '@/lib/quickWins';
import { QuickWinsClient } from './QuickWinsClient';
import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quick Wins',
  description: 'Personalized tips to improve your GitHub score and profile.',
};

export default async function QuickWinsPage({
  searchParams,
}: {
  searchParams: { username?: string };
}) {
  const username = searchParams.username;

  if (!username) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Username Provided</AlertTitle>
                <AlertDescription>
                    Please provide a GitHub username in the URL to see their Quick Wins. Example: `/quick-wins?username=torvalds`
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  try {
    const comprehensiveData = await fetchComprehensiveGitHubData(username);
    const { score: roastScore } = await calculateRoastScore(comprehensiveData.user, comprehensiveData.events, comprehensiveData.repos);
    const quickWins = calculateQuickWins({status: 'success', ...comprehensiveData, score: roastScore });
    const currentScore = 1000 - roastScore;

    return <QuickWinsClient username={username} initialWins={quickWins} initialScore={currentScore} />;
  } catch (error: any) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Data</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    )
  }
}
