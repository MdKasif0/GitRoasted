
import GitRoastClient from "@/components/GitRoastClient";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Leaderboard } from "@/components/Leaderboard";
import { FlameIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Moon, Star, Sun, X, BookUser, Trophy, Coffee } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <header className="w-full max-w-6xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/app-icon.png"
            alt="GitRoasted Logo"
            width={40}
            height={40}
            className="w-10 h-10 group-hover:scale-110 transition-transform"
          />
          <h1 className="text-2xl font-bold tracking-tighter hidden sm:block">
            GitRoasted
          </h1>
        </Link>
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
          <Link href="/support">
            <Coffee className="w-5 h-5 mr-2" />
            Buy me a Coffee
          </Link>
        </Button>
      </header>
      
      <div className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
            GitRoasted
        </h1>
        <p className="text-muted-foreground mt-3 text-lg md:text-xl max-w-2xl mx-auto">
          Get a savage (but friendly) AI-powered roast of any GitHub profile.
        </p>
         <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
            <Button asChild variant="link" className="text-primary">
              <Link href="/how-it-works" className='flex items-center gap-1'>
                <BookUser className="w-4 h-4" />
                How it works
              </Link>
            </Button>
             <Button asChild variant="link" className="text-primary">
              <Link href="/leaderboard" className='flex items-center gap-1'>
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
            </Button>
         </div>
      </div>


      <main className="w-full flex flex-col items-center gap-16">
        <GitRoastClient />
        <Leaderboard />
        <HowItWorksSection />
      </main>

      <footer className="w-full max-w-4xl mt-16 text-center text-muted-foreground text-sm">
        <p>Built with Next.js, Genkit, and a whole lot of 🔥</p>
        <div className="mt-2">
           <p>
            A project by <a href="https://x.com/rasultnt" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Rasul</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
