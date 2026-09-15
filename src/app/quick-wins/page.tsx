import { Suspense } from 'react';
import { QuickWinsClient } from './QuickWinsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Wins',
  description: 'Easy ways to boost your GitHub score and improve your developer profile. Get actionable tips based on your roast analysis.',
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 animate-pulse">
        {/* Navigation Skeleton */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
          <div className="h-6 w-28 bg-white/10 rounded" />
          <div className="h-8 w-24 bg-white/10 rounded-lg" />
        </div>

        {/* Profile Context Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/10 shrink-0" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-white/10 rounded" />
            <div className="h-3.5 w-24 bg-white/5 rounded" />
          </div>
        </div>

        {/* Title */}
        <div className="h-10 w-48 bg-white/10 rounded mb-2" />
        <div className="h-4 w-80 bg-white/5 rounded mb-8" />

        {/* Score Progression Strip Skeleton */}
        <div className="h-44 bg-white/[0.04] border border-white/[0.08] rounded-xl mb-10" />

        {/* Section Header & Filter Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-36 bg-white/10 rounded" />
          <div className="h-8 w-56 bg-white/5 rounded-lg" />
        </div>

        {/* 2-Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-white/[0.04] border border-white/[0.08] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuickWinsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <QuickWinsClient />
    </Suspense>
  );
}
