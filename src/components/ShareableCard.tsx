import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import type { RoastResultState } from "@/lib/types";
import Image from "next/image";
import { FlameIcon } from "./icons";
import { Card, CardContent } from "./ui/card";

interface ShareableCardDialogProps {
  result: RoastResultState;
}

export function ShareableCardDialog({ result }: ShareableCardDialogProps) {
    if (result.status !== 'success' || !result.user) {
        return null;
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="hover:scale-105 transition-transform">
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Roast
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-transparent border-none p-0 shadow-none">
        <div id="shareable-card" className="p-6 bg-gradient-to-br from-[#0f0f18] to-[#20133a] rounded-xl border border-purple-500/50 shadow-2xl shadow-purple-500/30">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <FlameIcon className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-white">GitRoasted</h2>
            </div>
            <Image
                src={result.user.avatar_url}
                alt={result.user.login}
                width={60}
                height={60}
                className="rounded-full border-2 border-primary"
            />
          </header>
          <div className="text-left mb-6">
            <h3 className="text-white text-2xl font-bold">{result.user.name || result.user.login}</h3>
            <p className="text-gray-400">@{result.user.login}</p>
          </div>
          <div className="my-6 text-center">
            <p className="text-gray-400 text-sm tracking-widest">ROAST SCORE</p>
            <p className="text-8xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">{result.score}</p>
          </div>
          <Card className="bg-black/30 p-4 rounded-lg border-purple-800/50">
            <CardContent className="p-0">
                <p className="text-gray-200 italic leading-snug">"{result.roast}"</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-center mt-4 text-gray-400 text-sm">
            Screenshot this card and share your glorious roast!
        </p>
      </DialogContent>
    </Dialog>
  );
}
