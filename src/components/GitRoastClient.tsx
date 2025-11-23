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
    <Button type="submit" disabled={pending} size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-24">
      {pending ? (
        <>
          <span className="animate-spin mr-2">
            <FlameIcon className="w-4 h-4" />
          </span>
          Roasting...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Roast
        </>
      )}
    </Button>
  );
}

function LoadingSkeleton() {
    return (
        <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-3 flex-1 w-full text-center sm:text-left">
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
                <Card className="mt-4 bg-background/50 border-purple-500/50">
                    <CardContent className='p-6'>
                        <Skeleton className="h-6 w-1/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}

export default function GitRoastClient() {
  const [state, formAction] = useActionState(getRoast, initialState);
  const { pending } = useFormStatus();

  const handleExampleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const username = e.currentTarget.value;
    const form = e.currentTarget.closest('form');
    if (form) {
      const input = form.querySelector<HTMLInputElement>('input[name="username"]');
      if (input) {
        input.value = username;
        form.requestSubmit();
      }
    }
  };


  return (
    <section className="w-full max-w-2xl">
        <Card className="relative p-0 overflow-hidden bg-transparent border-none shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-lg"></div>
          <CardContent className="relative p-2">
            <form action={formAction} className="relative flex items-center">
                <Github className="absolute left-4 text-muted-foreground" />
                <Input
                type="text"
                name="username"
                placeholder="Enter GitHub username..."
                required
                className="w-full h-16 pl-12 pr-28 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="GitHub username"
                />
                <SubmitButton />
            </form>
          </CardContent>
        </Card>

      <div className="flex items-center justify-center gap-2 mt-4 text-sm">
        <span className="text-muted-foreground">Try:</span>
        <form action={formAction}>
            <input type="hidden" name="username" value="torvalds" />
            <Button type="submit" variant="ghost" className="text-muted-foreground hover:text-primary" disabled={pending}>torvalds</Button>
        </form>
        <form action={formAction}>
            <input type="hidden" name="username" value="gaearon" />
            <Button type="submit" variant="ghost" className="text-muted-foreground hover:text-primary" disabled={pending}>gaearon</Button>
        </form>
        <form action={formAction}>
            <input type="hidden" name="username" value="rauchg" />
            <Button type="submit" variant="ghost" className="text-muted-foreground hover:text-primary" disabled={pending}>rauchg</Button>
        </form>
      </div>


      <div className="mt-8">
        {(state.status === 'loading' || (pending && state.status !== 'success')) && <LoadingSkeleton />}
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
