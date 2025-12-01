
import { getComparisonData } from '@/app/actions'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ComparisonDashboard } from '@/components/ComparisonDashboard'

interface ComparisonResultsPageProps {
  params: {
    user1: string
    user2: string
  }
}

export default async function ComparisonResultsPage({ params }: ComparisonResultsPageProps) {
  const { user1, user2 } = params;
  const { data1, data2, error } = await getComparisonData(user1, user2);

  if (error || !data1 || !data2) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Could Not Load Comparison</AlertTitle>
                <AlertDescription>
                    {error || 'An unexpected error occurred while fetching data for one or both users.'}
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
    <div className="p-4 sm:p-6 md:p-8">
        <Button asChild variant="ghost" className="absolute top-6 left-6 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20">
            <Link href={`/compare`}>
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </Button>
        <ComparisonDashboard user1Data={data1} user2Data={data2} />
    </div>
  )
}
