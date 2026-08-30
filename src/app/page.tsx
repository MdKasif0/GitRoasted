import GitRoastClient from "@/components/GitRoastClient";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { NavMenu } from "@/components/NavMenu";
import Link from 'next/link';
import { FlameIcon } from '@/components/icons';
import { Suspense } from "react";
import { LeaderboardClient } from "@/components/LeaderboardClient";
import { LeaderboardProvider } from "@/context/LeaderboardContext";
import { FaGithub, FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-primary/30">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <header className="w-full max-w-7xl flex items-center justify-between py-6 px-6 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <FlameIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]" />
            <span className="text-2xl font-bold tracking-tight text-white">GitRoasted</span>
          </Link>
          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
             AI-powered GitHub roasts
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <FaGithub className="w-5 h-5" />
            </a>
          </nav>
          <NavMenu />
        </div>
      </header>
      
      <main className="w-full max-w-7xl flex flex-col items-center relative z-10 px-4 sm:px-6">
        
        {/* HERO SECTION */}
        <div className="w-full max-w-4xl mt-16 mb-20 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-6 drop-shadow-[0_0_8px_rgba(255,138,0,0.3)]">
             <FlameIcon className="w-4 h-4" />
             AI-POWERED GITHUB ROASTS
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-tight leading-[1.1] text-white mb-6">
             Your GitHub deserves <br className="hidden sm:block" />
             to get <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] to-[#FF5C00] drop-shadow-[0_0_12px_rgba(255,138,0,0.4)]">roasted.</span>
          </h1>
          
          <p className="text-[#9CA3AF] text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-medium">
            Enter any GitHub username and let AI turn their commits, repos, and developer habits into a savage but friendly roast.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-[#9CA3AF] font-medium mb-12">
             <span className="flex items-center gap-2"><span className="text-primary">✨</span> Powered by AI</span>
             <span className="w-1 h-1 rounded-full bg-white/20" />
             <span className="flex items-center gap-2"><span className="text-yellow-500">🛡️</span> Based on public GitHub data</span>
          </div>

          <LeaderboardProvider>
            <GitRoastClient />
          </LeaderboardProvider>
        </div>

        {/* HOW IT WORKS */}
        <div id="how-it-works" className="w-full mt-10">
          <HowItWorksSection />
        </div>

        {/* LEADERBOARD */}
        <div id="leaderboard" className="w-full mt-32 mb-20">
          <LeaderboardProvider>
             <LeaderboardClient />
          </LeaderboardProvider>
        </div>
        
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mt-auto pt-16 pb-8 px-6 border-t border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1 flex flex-col items-start">
               <Link href="/" className="flex items-center gap-2 mb-4">
                  <FlameIcon className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold text-white">GitRoasted</span>
               </Link>
               <p className="text-[#9CA3AF] text-sm mb-6">Turn GitHub activity into comedy.</p>
               <div className="flex gap-4 text-[#9CA3AF]">
                  <a href="#" className="hover:text-white transition-colors"><FaGithub className="w-5 h-5"/></a>
                  <a href="#" className="hover:text-white transition-colors"><FaTwitter className="w-5 h-5"/></a>
                  <a href="#" className="hover:text-white transition-colors"><FaYoutube className="w-5 h-5"/></a>
                  <a href="#" className="hover:text-white transition-colors"><FaEnvelope className="w-5 h-5"/></a>
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
               <h4 className="text-white font-semibold mb-2">Product</h4>
               <Link href="#how-it-works" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">How it works</Link>
               <Link href="#leaderboard" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">Leaderboard</Link>
               <Link href="/about" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">About</Link>
            </div>

            <div className="flex flex-col gap-3">
               <h4 className="text-white font-semibold mb-2">Resources</h4>
               <a href="https://github.com/MdKasif0/GitRoasted" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">GitHub</a>
               <Link href="/privacy" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">Privacy</Link>
            </div>

            <div className="flex flex-col gap-3">
               <h4 className="text-white font-semibold mb-2">Built for developers</h4>
               <p className="text-[#9CA3AF] text-sm mb-4">Built for developers who can handle the heat.</p>
               <div className="inline-flex items-center self-start px-3 py-1.5 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-primary">
                  git push --roast
               </div>
            </div>
         </div>
         <div className="text-center text-[#9CA3AF] text-xs pt-8 border-t border-white/5">
            © {new Date().getFullYear()} GitRoasted. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
