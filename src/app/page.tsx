
import GitRoastClient from "@/components/GitRoastClient";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { NavMenu } from "@/components/NavMenu";
import { BookUser, Trophy, Contact, Github } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { LeaderboardClient } from "@/components/LeaderboardClient";
import { LeaderboardProvider } from "@/context/LeaderboardContext";
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa'


export const dynamic = 'force-dynamic';

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
        <NavMenu />
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
        <LeaderboardProvider>
          <GitRoastClient />
          <Suspense fallback={<Skeleton className="h-[400px] w-full max-w-4xl" />}>
            <LeaderboardClient />
          </Suspense>
        </LeaderboardProvider>
        <HowItWorksSection />
      </main>

      <footer className="w-full max-w-6xl mt-16 border-t border-purple-500/10 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg text-foreground">GitRoasted</h3>
            <p className="text-muted-foreground">Get your GitHub profile roasted!</p>
            <div className="flex items-center gap-3 pt-2">
                <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FaGithub className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/md_kasif_uddin" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FaTwitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/md_kasif_uddin" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FaInstagram className="w-5 h-5" />
                </a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/support" className="hover:text-primary transition-colors">Buy me a coffee</Link></li>
              <li><a href="https://github.com/MdKasif0/GitRoasted/issues" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Report a Bug</a></li>
            </ul>
          </div>
          <div className="space-y-3">
             <h4 className="font-semibold text-foreground">Legal</h4>
             <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GitRoasted. Made with 🔥 for developers.</p>
        </div>
      </footer>
    </div>
  );
}
