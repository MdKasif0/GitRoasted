
import { Suspense } from 'react';
import { QuickWinsClient } from './QuickWinsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Wins',
  description: 'Easy ways to boost your GitHub score and improve your developer profile. Get actionable tips based on your roast analysis.',
};

function LoadingSkeleton() {
    return (
        <div className="min-h-screen w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse">
            <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
            <div className="flex flex-col items-center text-center mb-12">
                <div className="h-24 w-24 bg-muted rounded-full mb-4"></div>
                <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
                <div className="h-6 w-32 bg-muted rounded-md"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg"></div>
                ))}
            </div>
        </div>
    )
}

export default function QuickWinsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <QuickWinsClient />
    </Suspense>
  );
}
