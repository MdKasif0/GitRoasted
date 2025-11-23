import GitRoastClient from "@/components/GitRoastClient";
import { Leaderboard } from "@/components/Leaderboard";
import { FlameIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Moon, Star, Sun, X } from "lucide-react";

const navItems = [
  { name: 'Leaderboard', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Share', href: '#' },
];

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <FlameIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">GitRoasted</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <a key={item.name} href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">{item.name}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            <Sun className="h-4 w-4 mr-2" /> / <Moon className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hidden sm:flex">
            <X className="h-4 w-4 mr-2" /> Random Profile
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
            <Star className="h-4 w-4 mr-2 text-yellow-400" /> GitHub stars <span className="ml-2 font-bold">1.2k</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function FloatingCards() {
  return (
    <div className="hidden lg:block relative w-full h-full">
        <div className="absolute top-[5%] right-[5%] w-[300px] h-[200px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform rotate-[-12deg] shadow-2xl shadow-purple-500/20 animate-in fade-in-0 zoom-in-90 duration-700">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center border-2 border-primary/50">
                  <Github className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="w-24 h-4 bg-muted/50 rounded" />
                  <div className="w-16 h-3 bg-muted/30 rounded mt-2" />
                </div>
              </div>
              <div className="mt-4 w-24 h-24 rounded-full mx-auto bg-primary/10 border-4 border-primary flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">87</span>
              </div>
            </div>
        </div>
        <div className="absolute top-[40%] right-[20%] w-[320px] h-[220px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform rotate-[8deg] shadow-2xl shadow-blue-500/20 animate-in fade-in-0 zoom-in-90 duration-1000 delay-300">
            <div className="p-4">
              <h4 className="font-bold text-lg flex items-center gap-2"><FlameIcon className="w-5 h-5 text-primary" /> Your Roast</h4>
              <p className="text-sm text-muted-foreground mt-2 italic">
                Ouch, Alex! Your commit history is a rollercoaster. You spend debating in comments than actually coding in PR, seore thern diag. [average pert in red]. But hey, your streak are as impressive a e cafleine-warws as a fueled marathon [appreciation part in bluei]. Kaep shipping this "quick fixes" at 3 AM!
              </p>
            </div>
        </div>
        <div className="absolute bottom-[10%] right-[0%] w-[300px] h-[200px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform rotate-[-6deg] shadow-2xl shadow-red-500/20 animate-in fade-in-0 zoom-in-90 duration-1000 delay-500">
          <div className="p-4">
            <h4 className="font-bold text-lg flex items-center gap-2"><FlameIcon className="w-5 h-5 text-primary" /> GitRoasted</h4>
            <p className="text-lg font-bold">Roast Score: <span className="text-primary">92%</span></p>
            <div className="w-full h-20 bg-muted/20 mt-2 rounded-md" />
          </div>
        </div>
    </div>
  )
}

function StatsFooter() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm">
      <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 p-2 flex justify-around items-center text-sm">
        <p>Total Roasts: <span className="font-bold text-foreground">45,230+</span></p>
        <div className="w-px h-6 bg-white/10" />
        <p>Active Users: <span className="font-bold text-foreground">18,500+</span></p>
        <div className="w-px h-6 bg-white/10" />
        <p>GitHub Stars: <span className="font-bold text-foreground">1,245</span></p>
      </div>
    </div>
  )
}


export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Header />
      <main className="container mx-auto pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-red-400 to-primary">Get Roasted</span><br/>
              by Your Git<br/>
              Commits
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-md mx-auto lg:mx-0">
              We analyze your GitHub profile, find your most questionable coding habits, and serve them up in a fiery, fun roast. Are you ready to handle the heat?
            </p>
            <GitRoastClient />
          </div>
          <FloatingCards />
        </div>
      </main>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Scroll for more</span>
      </div>
      <StatsFooter />
      <div className="container mx-auto py-20">
          <Leaderboard />
      </div>
       <footer className="w-full text-center text-muted-foreground text-sm py-8">
        <p>Built with Next.js, Genkit, and a whole lot of 🔥</p>
      </footer>
    </div>
  );
}