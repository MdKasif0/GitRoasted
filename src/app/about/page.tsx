import { NavMenu } from "@/components/NavMenu";
import Link from 'next/link';
import { FlameIcon } from '@/components/icons';
import { FaGithub, FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { Database, BrainCircuit, Zap, Code2, Cpu, FileCode2 } from 'lucide-react';

export const metadata = {
  title: 'About | GitRoasted',
  description: 'The story behind the most savage developer tool on the internet.',
};

export default function AboutPage() {
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
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/#leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/about" className="text-white font-semibold transition-colors">About</Link>
            <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
               <FaGithub className="w-5 h-5" />
            </a>
          </nav>
          <NavMenu />
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center relative z-10 px-6 py-20 mx-auto">
         
         {/* Hero Section */}
         <div className="text-center max-w-3xl mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs tracking-widest uppercase mb-6 drop-shadow-[0_0_8px_rgba(255,138,0,0.3)]">
                 <FlameIcon className="w-3 h-3" />
                 Our Philosophy
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Brutal honesty as a <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] to-[#FF5C00] drop-shadow-[0_0_12px_rgba(255,138,0,0.4)]">service.</span>
             </h1>
             <p className="text-[#9CA3AF] text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                 We believe that if your codebase can't survive a roast, it probably won't survive production. GitRoasted brings humility back to software engineering.
             </p>
         </div>

         {/* The Engine Grid */}
         <div className="w-full mb-32">
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-white mb-4">How the engine works</h2>
                 <p className="text-[#9CA3AF] max-w-xl mx-auto">An entirely automated pipeline designed to find every flaw in your perfectly curated GitHub profile.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                         <Database className="w-6 h-6 text-white group-hover:text-primary" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">1. Data Extraction</h3>
                     <p className="text-[#9CA3AF] text-sm leading-relaxed">
                         We securely query the GitHub API to fetch your public repository stats, recent commits, follower ratios, and top languages.
                     </p>
                 </div>
                 
                 <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                         <BrainCircuit className="w-6 h-6 text-white group-hover:text-primary" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">2. AI Analysis</h3>
                     <p className="text-[#9CA3AF] text-sm leading-relaxed">
                         The raw metadata is fed into an advanced LLM configured with a hyper-cynical system prompt that mimics a disgruntled Principal Engineer.
                     </p>
                 </div>
                 
                 <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                         <Zap className="w-6 h-6 text-white group-hover:text-primary" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">3. The Roast</h3>
                     <p className="text-[#9CA3AF] text-sm leading-relaxed">
                         You receive an unfiltered, personalized roast complete with a Seriousness Score and an automatic placement on the Hall of Flame.
                     </p>
                 </div>
             </div>
         </div>

         {/* Tech Stack Bento */}
         <div className="w-full mb-32">
             <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Built for scale.</h2>
                    <p className="text-[#9CA3AF]">The architecture powering the roasts.</p>
                 </div>
                 <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm">
                     View source code &rarr;
                 </a>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {/* Main Block */}
                 <div className="md:col-span-2 md:row-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors" />
                     <div className="relative z-10 mb-12">
                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                             <Cpu className="w-6 h-6 text-white" />
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-2">Next.js 14 App Router</h3>
                         <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
                             Leveraging Server Actions for secure API calls and React Server Components for lightning-fast initial page loads.
                         </p>
                     </div>
                     <div className="relative z-10 w-full h-32 border border-white/10 rounded-xl bg-[#050505] flex items-center justify-center">
                          <code className="text-xs text-primary/80 font-mono">export default async function Roast()</code>
                     </div>
                 </div>
                 
                 {/* Small Block 1 */}
                 <div className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:border-white/20 transition-colors">
                     <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                         <BrainCircuit className="w-5 h-5 text-white" />
                     </div>
                     <div>
                         <h3 className="font-bold text-white text-lg mb-1">Google Gemini</h3>
                         <p className="text-[#9CA3AF] text-xs leading-relaxed">Advanced language models parsing structural code metrics into savage humor.</p>
                     </div>
                 </div>
                 
                 {/* Small Block 2 */}
                 <div className="md:col-span-1 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                     <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                         <FileCode2 className="w-5 h-5 text-white" />
                     </div>
                     <div>
                         <h3 className="font-bold text-white mb-1">Tailwind CSS</h3>
                         <p className="text-[#9CA3AF] text-xs">Premium dark aesthetics.</p>
                     </div>
                 </div>

                 {/* Small Block 3 */}
                 <div className="md:col-span-1 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                     <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                         <Database className="w-5 h-5 text-white" />
                     </div>
                     <div>
                         <h3 className="font-bold text-white mb-1">Firestore</h3>
                         <p className="text-[#9CA3AF] text-xs">Realtime leaderboard scaling.</p>
                     </div>
                 </div>
             </div>
         </div>

         {/* CTA */}
         <div className="w-full bg-gradient-to-br from-[#101010] to-[#050505] border border-white/10 rounded-[2rem] p-12 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center">
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Think you can build it better?</h2>
                 <p className="text-[#9CA3AF] mb-8 max-w-lg mx-auto">
                    GitRoasted is completely open-source. If the AI isn't savage enough, submit a PR. Just don't push spaghetti code.
                 </p>
                 <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                     <FaGithub className="w-5 h-5" /> Fork on GitHub
                 </a>
             </div>
         </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mt-auto pt-16 pb-8 px-6 border-t border-white/5 relative z-10">
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
               <Link href="/#how-it-works" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">How it works</Link>
               <Link href="/#leaderboard" className="text-[#9CA3AF] hover:text-white text-sm transition-colors">Leaderboard</Link>
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
