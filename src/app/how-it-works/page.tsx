
import { HowItWorksSection } from '@/components/HowItWorksSection';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'Learn how GitRoasted analyzes your GitHub profile, calculates your score, and generates a savage AI roast. From data fetching to the final score breakdown.',
    alternates: {
        canonical: '/how-it-works',
    },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
        <div className="absolute top-6 left-6 z-20">
            <Button asChild variant="ghost" size="icon" className="bg-white/5 backdrop-blur-sm border border-white/10 h-10 w-10">
                <Link href="/" aria-label="Back to Home">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
        </div>
      <HowItWorksSection />
      <footer className="text-center text-muted-foreground mt-8">
        <p>
            <Link href="/" className="hover:text-primary">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
