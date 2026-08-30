import { NavMenu } from "@/components/NavMenu";
import Link from 'next/link';
import { FlameIcon } from '@/components/icons';
import { FaGithub, FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';

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

      <main className="w-full max-w-3xl flex flex-col items-start relative z-10 px-6 py-20 mx-auto">
         
         <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-4 drop-shadow-[0_0_8px_rgba(255,138,0,0.3)]">
             <FlameIcon className="w-4 h-4" />
             THE ORIGIN STORY
         </div>

         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-8">
            Built for developers who can <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] to-[#FF5C00] drop-shadow-[0_0_12px_rgba(255,138,0,0.4)]">handle the heat.</span>
         </h1>

         <div className="max-w-none space-y-6 text-[#9CA3AF] text-lg">
             <p className="font-medium text-xl text-white/80 leading-relaxed">
                 We believe that if your code can't survive a roast, it probably won't survive production. 
             </p>
             
             <p className="leading-relaxed">
                 GitRoasted started as a joke during a late-night debugging session. We realized developers take themselves way too seriously, treating their GitHub graphs like sacred monuments. We decided it was time to bring some humility back to the community.
             </p>

             <h2 className="text-2xl font-bold text-white mt-12 mb-4">How it actually works</h2>
             <p className="leading-relaxed">
                 When you submit a username, GitRoasted's engine fetches their public metadata via the GitHub API—including recent commits, repository stats, follower counts, and language breakdowns. 
             </p>
             <p className="leading-relaxed">
                 We then feed this raw data into an advanced Large Language Model with a very specific, sarcastic system prompt. The AI acts as a seasoned, cynical principal engineer who is thoroughly unimpressed by your "Hello World" repositories.
             </p>

             <h2 className="text-2xl font-bold text-white mt-12 mb-4">The tech stack</h2>
             <p className="leading-relaxed">
                 GitRoasted is built with modern web technologies:
             </p>
             <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                 <li><strong className="text-white">Next.js 14</strong> for the App Router and Server Actions.</li>
                 <li><strong className="text-white">Tailwind CSS</strong> for this meticulously crafted dark aesthetic.</li>
                 <li><strong className="text-white">GitHub REST API</strong> for fetching your embarrassing commit histories.</li>
                 <li><strong className="text-white">Google Gemini / OpenAI</strong> for generating the brutal roasts.</li>
                 <li><strong className="text-white">Firebase Firestore</strong> for the Hall of Flame leaderboard.</li>
             </ul>

             <div className="mt-16 p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                 <h3 className="text-xl font-bold text-white mb-4">Want to contribute?</h3>
                 <p className="mb-6 leading-relaxed">
                    GitRoasted is completely open-source. If you think the AI isn't savage enough, or if you want to help build new features, PRs are always welcome. Just don't write spaghetti code—we will roast it in the PR review.
                 </p>
                 <a href="https://github.com/MdKasif0/GitRoasted" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-lg font-medium transition-colors">
                     <FaGithub className="w-5 h-5" /> View on GitHub
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
