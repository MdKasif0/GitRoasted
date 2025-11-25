
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { getRoast } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Github, Loader2, Search } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { RoastResultState } from '@/lib/types';
import { FlameIcon } from './icons';
import { LoadingModal } from './LoadingModal';
import { useLeaderboard } from '@/context/LeaderboardContext';

const initialState: RoastResultState = {
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
        type="submit" 
        disabled={pending} 
        size="lg" 
        className="shrink-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 hover:scale-105"
    >
      {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Roasting...
          </span>
      ) : (
        'Roast!'
      )}
       <span className="sr-only">Roast</span>
    </Button>
  );
}


export default function GitRoastClient() {
  const [state, formAction, isPending] = useActionState(getRoast, initialState);
  const [username, setUsername] = useState('');
  const { addUser } = useLeaderboard();
  
  const handleFormAction = (payload: FormData) => {
    const user = payload.get('username') as string;
    setUsername(user);
    formAction(payload);
  }

  useEffect(() => {
    if (state.status === 'success' && state.newLeaderboardEntry) {
        addUser(state.newLeaderboardEntry);
    }
  }, [state.status, state.newLeaderboardEntry, addUser])

  return (
    <section className="w-full max-w-md md:max-w-xl lg:max-w-4xl">
        <form action={handleFormAction} className="relative flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center w-full h-14 px-4 bg-white/5 border border-white/10 rounded-full focus-within:ring-2 focus-within:ring-primary/50 backdrop-blur-sm transition-all">
                <Github className="text-muted-foreground w-6 h-6 mr-3 shrink-0" />
                <Input
                    type="text"
                    name="username"
                    placeholder="Enter GitHub username..."
                    required
                    className="w-full h-auto p-0 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="GitHub username"
                />
            </div>
            <SubmitButton />
        </form>

      <div className="flex items-center flex-wrap gap-2 mt-4 text-sm justify-center sm:justify-start">
        <span className="text-muted-foreground">Try:</span>
        <form action={handleFormAction}>
            <input type="hidden" name="username" value="torvalds" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={isPending}>torvalds</Button>
        </form>
        <form action={handleFormAction}>
            <input type="hidden" name="username" value="gaearon" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={isPending}>gaearon</Button>
        </form>
        <form action={handleFormAction}>
            <input type="hidden" name="username" value="rauchg" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={isPending}>rauchg</Button>
        </form>
        <form action={handleFormAction}>
            <input type="hidden" name="username" value="sindresorhus" />
            <Button type="submit" variant="outline" size="sm" className="text-muted-foreground bg-white/5 border-white/10 h-auto px-3 py-1" disabled={isPending}>sindresorhus</Button>
        </form>
      </div>


      <div className="mt-8">
        {isPending && <LoadingModal username={username} />}
        
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
