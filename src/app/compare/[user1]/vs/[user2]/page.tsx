
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getComparisonData } from '@/app/actions'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ComparisonDashboard } from '@/components/ComparisonDashboard'
import { Skeleton } from '@/components/ui/skeleton'

// Error Component
const ErrorState = ({ title, message, action, actionText = 'Try Again' }: any) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button onClick={action}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {actionText}
        </Button>
    </div>
)

// Loading Skeleton
const ComparisonLoadingSkeleton = () => (
    <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
)

export default function ComparisonResultsPage() {
    const params = useParams()
    const router = useRouter()
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    const user1 = params.user1 ? decodeURIComponent(params.user1 as string) : null
    const user2 = params.user2 ? decodeURIComponent(params.user2 as string) : null

    useEffect(() => {
        if (!user1 || !user2 || user1 === 'undefined' || user2 === 'undefined') {
            console.error('Missing or invalid params:', { user1, user2 })
            router.push('/compare')
            return
        }

        const fetchData = async () => {
            setLoading(true)
            try {
                const result = await getComparisonData(user1, user2)
                if (result.error) {
                    let errorUsername = '';
                    if (result.error.includes(user1)) errorUsername = user1;
                    if (result.error.includes(user2)) errorUsername = user2;
                    
                    if (result.error.includes('404')) {
                         setError({ status: 404, username: errorUsername, message: `GitHub user not found.` });
                    } else {
                        setError({ message: result.error })
                    }
                } else {
                    setData(result)
                }
            } catch (e: any) {
                setError({ message: e.message || 'An unexpected error occurred.' })
            }
            setLoading(false)
        }

        fetchData()
    }, [user1, user2, router])

    if (loading) return <ComparisonLoadingSkeleton />

    if (error) {
         if (error.status === 404) {
            return (
                <ErrorState
                    title="User Not Found"
                    message={`The GitHub user "${error.username}" does not exist. Please check the username and try again.`}
                    action={() => router.push('/compare')}
                    actionText="Back to Compare"
                />
            )
        }
        return (
            <ErrorState
                title="Could Not Load Comparison"
                message={error.message}
                action={() => router.push('/compare')}
                actionText="Back to Compare"
            />
        )
    }

    if (!data?.data1 || !data?.data2) return null;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <Button asChild variant="ghost" className="absolute top-6 left-6 bg-white/5 backdrop-blur-sm border border-white/10 h-12 w-12 rounded-full z-20 no-print">
                <Link href={`/compare`}>
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </Button>
            <ComparisonDashboard user1Data={data.data1} user2Data={data.data2} />
        </div>
    )
}
