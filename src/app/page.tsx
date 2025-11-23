import GitRoastClient from "@/components/GitRoastClient";
import { Leaderboard } from "@/components/Leaderboard";
import { FlameIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Moon, Star, Sun, X, BookUser, Trophy, Coffee } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mx-auto">
          <Image
            src="/app-icon.png"
            alt="GitRoasted Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
            GitRoasted
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
          Get a savage (but friendly) roast of any GitHub profile.
        </p>
         <div className="flex items-center justify-center gap-4 mt-2">
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
             <Button asChild variant="link" className="text-primary">
              <Link href="/support" className='flex items-center gap-1'>
                <Coffee className="w-4 h-4" />
                Support Us
              </Link>
            </Button>
         </div>
      </header>

      <main className="w-full flex flex-col items-center gap-8">
        <GitRoastClient />
        <Leaderboard />
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-muted-foreground text-sm">
        <p>Built with Next.js, Genkit, and a whole lot of 🔥</p>
      </footer>
    </div>
  );
}
