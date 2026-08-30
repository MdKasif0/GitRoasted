'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getRoast } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Github, Loader2, Lock, BrainCircuit, Zap } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import type { RoastResultState } from '@/lib/types';
import { LoadingModal } from './LoadingModal';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { FlameIcon } from './icons';

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
        className="shrink-0 h-12 px-6 sm:px-8 bg-gradient-to-br from-[#FF9F1C] to-[#FF5C00] text-black font-bold hover:brightness-110 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(255,138,0,0.3)] hover:shadow-[0_0_25px_rgba(255,138,0,0.5)] border border-[#FF8A00]"
    >
      {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Roasting...
          </span>
      ) : (
        <span className="flex items-center gap-2">
            <FlameIcon className="w-4 h-4 text-black" />
            Roast Me <span className="text-black/80 hidden sm:inline">🔥</span>
        </span>
      )}
       <span className="sr-only">Roast</span>
    </Button>
  );
}

const Chip = ({ username, image, isPending }: { username: string, image: string, isPending: boolean }) => {
    const { pending } = useFormStatus();
    const disabled = isPending || pending;
    
    return (
        <button 
            type="submit" 
            name="username" 
            value={username}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-primary/50 rounded-full transition-all duration-200 group hover:shadow-[0_0_10px_rgba(255,138,0,0.2)] disabled:opacity-50"
        >
            <Image src={image} alt={username} width={20} height={20} className="rounded-full opacity-80 group-hover:opacity-100" />
            <span className="text-sm font-medium text-[#9CA3AF] group-hover:text-white transition-colors">{username}</span>
        </button>
    );
};


export default function GitRoastClient() {
  const [state, formAction, isPending] = useActionState(getRoast, initialState);
  const [username, setUsername] = useState('');
  const { addUser } = useLeaderboard();
  const router = useRouter();
  
  const handleFormAction = (payload: FormData) => {
    const user = payload.get('username') as string;
    setUsername(user);
    formAction(payload);
  }

  useEffect(() => {
    if (state.status === 'success' && state.user) {
        try {
            const dataToCache = { 
                ...state, 
                newLeaderboardEntry: undefined,
                timestamp: Date.now(),
            };
            localStorage.setItem(`gitroasted_data_${state.user.login.toLowerCase()}`, JSON.stringify(dataToCache));
        } catch (error) {
            console.warn("Could not save roast data to localStorage", error);
        }
        
        if (state.newLeaderboardEntry) {
            addUser(state.newLeaderboardEntry);
        }

        // Redirect to the newly redesigned Dashboard page!
        router.push(`/dashboard?username=${state.user.login}`);
    }
  }, [state, addUser, router])

  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <form action={handleFormAction} className="w-full relative flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex flex-1 items-center w-full h-[68px] px-2 sm:px-3 bg-[#0A0A0A] border border-white/10 rounded-2xl focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(255,138,0,0.15)] shadow-inner transition-all group">
                <div className="hidden sm:flex items-center gap-3 pl-4 pr-2 text-[#9CA3AF]">
                    <Github className="w-6 h-6 text-white group-focus-within:text-white transition-colors" />
                    <span className="text-lg hidden md:block">github.com/</span>
                </div>
                <Input
                    type="text"
                    name="username"
                    placeholder="username"
                    required
                    className="flex-1 h-full p-2 text-xl bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-[#9CA3AF]/50"
                    aria-label="GitHub username"
                />
                <div className="hidden sm:block">
                  <SubmitButton />
                </div>
            </div>
            <div className="w-full sm:hidden">
                <SubmitButton />
            </div>
        </form>

      <div className="flex items-center w-full max-w-full overflow-x-auto pb-2 scrollbar-hide gap-3 justify-start sm:justify-center mb-12">
        <span className="text-[#9CA3AF] text-sm whitespace-nowrap shrink-0">Try roasting:</span>
        <form action={handleFormAction} className="flex gap-2">
            <Chip username="torvalds" image="https://avatars.githubusercontent.com/u/1024025?v=4" isPending={isPending} />
            <Chip username="gaearon" image="https://avatars.githubusercontent.com/u/810438?v=4" isPending={isPending} />
            <Chip username="rauchg" image="https://avatars.githubusercontent.com/u/13041?v=4" isPending={isPending} />
            <Chip username="sindresorhus" image="https://avatars.githubusercontent.com/u/170270?v=4" isPending={isPending} />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-left mb-8 w-full">
         <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                 <Lock className="w-5 h-5 text-primary" />
             </div>
             <div>
                 <h4 className="font-semibold text-white text-sm mb-1">Public GitHub data</h4>
                 <p className="text-[#9CA3AF] text-xs leading-relaxed">We only analyze what's publicly available on GitHub.</p>
             </div>
         </div>
         <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                 <BrainCircuit className="w-5 h-5 text-primary" />
             </div>
             <div>
                 <h4 className="font-semibold text-white text-sm mb-1">AI-generated roast</h4>
                 <p className="text-[#9CA3AF] text-xs leading-relaxed">Savage but friendly roasts powered by advanced AI.</p>
             </div>
         </div>
         <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                 <Zap className="w-5 h-5 text-primary" />
             </div>
             <div>
                 <h4 className="font-semibold text-white text-sm mb-1">Instant results</h4>
                 <p className="text-[#9CA3AF] text-xs leading-relaxed">Get your customized roast delivered in seconds.</p>
             </div>
         </div>
      </div>

      <div className="mt-8 w-full">
        {isPending && <LoadingModal username={username} />}
        
        {state.status === 'error' && (
          <Alert variant="destructive" className="max-w-4xl mx-auto bg-red-500/10 border-red-500/50 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>The grill overheated!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
}
