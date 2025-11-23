'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { getRoast } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Github, Search } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { RoastResultState } from '@/lib/types';
import { FlameIcon } from './icons';

const initialState: RoastResultState = {
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="shrink-0">
      {pending ? (
          <span className="animate-spin">
            <FlameIcon className="w-5 h-5" />
          </span>
      ) : (
        <>
          <FlameIcon className="w-5 h-5 mr-2" />
          Roast!
        </>
      )}
       <span className="sr-only">Roast</span>
    </Button>
  );
}

function LoadingSkeleton() {
    return (
        <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardContent className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-20 w-20 mt-4" />
                    </div>
                    {/* Right Column Skeleton */}
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function GitRoastClient() {
  const [state, formAction] = useActionState(getRoast, initialState);
  const { pending } = useFormStatus();

  return (
    <section className="w-full max-w-md md:max-w-xl lg:max-w-4xl">
        <form action={formAction} className="relative flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    name="username"
                    placeholder="Enter GitHub username..."
                    required
                    className="w-full h-14 pl-12 pr-4 text-lg bg-white/5 border-white/10 rounded-full focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:ring-2 backdrop-blur-sm"
                    aria-label="GitHub username"
                />
            </div>
            <SubmitButton />
        </form>

      <div className="flex items-center flex-wrap gap-2 mt-4 text-sm justify-center sm:justify-start">
        <span className="text-muted-foreground">Try:</span>
        <form action={formAction}>
            <input type="hidden" name="username" value="torvalds" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={pending}>torvalds</Button>
        </form>
        <form action={formAction}>
            <input type="hidden" name="username" value="gaearon" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={pending}>gaearon</Button>
        </form>
        <form action={formAction}>
            <input type="hidden" name="username" value="rauchg" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={pending}>rauchg</Button>
        </form>
        <form action={formAction}>
            <input type="hidden" name="username" value="sindresorhus" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={pending}>sindresorhus</Button>
        </form>
      </div>


      <div className="mt-8">
        {pending && state.status !== 'success' && <LoadingSkeleton />}
        
        {state.status === 'error' && (
          <Alert variant="destructive" className="max-w-4xl mx-auto bg-destructive/20 border-destructive/50 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Roast Failed!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.status === 'success' && <ProfileCard key={state.user?.id} result={state} />}
      </div>
    </section>
  );
}
