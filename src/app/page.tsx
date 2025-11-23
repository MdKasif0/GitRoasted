import GitRoastClient from "@/components/GitRoastClient";
import { Leaderboard } from "@/components/Leaderboard";
import { FlameIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-center gap-3">
          <FlameIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-400">
            GitRoast
          </h1>
        </div>
        <p className="text-center text-muted-foreground mt-2">
          Enter a GitHub username to get a roast based on their commit history.
        </p>
      </header>
      
      <main className="w-full flex flex-col items-center gap-8">
        <GitRoastClient />
        <Leaderboard />
      </main>
    </div>
  );
}
