'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { getRoast } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlameIcon } from './icons';
import { ProfileCard } from './ProfileCard';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { RoastResultState } from '@/lib/types';

const initialState: RoastResultState = {
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <span className="animate-spin mr-2">
            <FlameIcon className="w-4 h-4" />
          </span>
          Roasting...
        </>
      ) : (
        <>
          <FlameIcon className="mr-2 h-4 w-4" />
          Roast Me
        </>
      )}
    </Button>
  );
}

function LoadingSkeleton() {
    return (
        <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Skeleton className="h-[100px] w-[100px] rounded-full" />
                    <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                        <Skeleton className="h-8 w-1/2 mx-auto sm:mx-0" />
                        <Skeleton className="h-6 w-1/4 mx-auto sm:mx-0" />
                        <Skeleton className="h-4 w-3/4 mx-auto sm:mx-0" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
            </CardContent>
        </Card>
    )
}

export default function GitRoastClient() {
  const [state, formAction] = useActionState(getRoast, initialState);

  return (
    <section className="w-full max-w-4xl">
      <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
        <CardContent className="p-6">
          <form action={formAction} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              name="username"
              placeholder="Enter a GitHub username..."
              required
              className="flex-grow text-lg h-12"
              aria-label="GitHub username"
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        {state.status === 'loading' && <LoadingSkeleton />}
        {state.status === 'error' && (
          <Alert variant="destructive" className="max-w-4xl mx-auto bg-destructive/20 border-destructive/50 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Roast Failed!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.status === 'success' && <ProfileCard result={state} />}
      </div>
    </section>
  );
}
