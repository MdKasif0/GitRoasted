
import { Suspense } from 'react';
import { DashboardClient } from './DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your complete GitHub analysis and improvement plan.',
};

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
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}
