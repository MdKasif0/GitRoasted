
'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchComprehensiveGitHubData } from '@/lib/github'
import { calculateRoastScore } from '@/lib/scoring'
import type { RoastResultState } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function ComparisonLoadingSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-[600px] w-full bg-muted rounded-lg" />
                <Skeleton className="h-[600px] w-full bg-muted rounded-lg" />
            </div>
        </div>
    )
}

export default function ComparisonResultsPage() {
  const params = useParams()
  const user1 = params.user1 as string
  const user2 = params.user2 as string
  
  const [data1, setData1] = useState<RoastResultState | null>(null)
  const [data2, setData2] = useState<RoastResultState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user1 || !user2) return;

    const loadComparisonData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch both users in parallel
        const [result1, result2] = await Promise.all([
          fetchComprehensiveGitHubData(user1).then(async (data) => ({
            ...data,
            roastResult: await calculateRoastScore(data.user, data.events, data.repos)
          })),
          fetchComprehensiveGitHubData(user2).then(async (data) => ({
            ...data,
            roastResult: await calculateRoastScore(data.user, data.events, data.repos)
          }))
        ]);
        
        setData1({ status: 'success', ...result1, score: result1.roastResult.score, breakdown: result1.roastResult.breakdown, archetype: result1.roastResult.archetype });
        setData2({ status: 'success', ...result2, score: result2.roastResult.score, breakdown: result2.roastResult.breakdown, archetype: result2.roastResult.archetype });

      } catch (err: any) {
        console.error('Comparison error:', err)
        setError(err.message || `Failed to fetch data for one or both users.`)
      } finally {
        setLoading(false)
      }
    }

    loadComparisonData()
  }, [user1, user2])

  if (loading) return <ComparisonLoadingSkeleton />
  
  if(error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Comparison</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
             <Button asChild>
                <Link href="/compare">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Compare
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div>
        <h1 className="text-2xl font-bold text-center p-8">Comparison Dashboard (Coming Soon!)</h1>
        <div className="grid grid-cols-2 gap-4 p-4">
            <pre className="bg-muted p-4 rounded-lg overflow-auto"><code>{JSON.stringify(data1, null, 2)}</code></pre>
            <pre className="bg-muted p-4 rounded-lg overflow-auto"><code>{JSON.stringify(data2, null, 2)}</code></pre>
        </div>
    </div>
  )
}
