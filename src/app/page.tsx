import GitRoastClient from "@/components/GitRoastClient";
import { Leaderboard } from "@/components/Leaderboard";
import { FlameIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mx-auto">
          <FlameIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
            GitRoast
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
          Get a savage (but friendly) roast of any GitHub profile.
        </p>
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
