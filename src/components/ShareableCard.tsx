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
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Roast
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-indigo-900/80 backdrop-blur-xl border-primary">
        <div id="shareable-card" className="p-6 bg-gradient-to-br from-background to-indigo-950/50 rounded-lg">
          <DialogHeader className="text-left">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FlameIcon className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl font-bold text-white">GitRoast</h2>
                </div>
                <Image
                    src={result.user.avatar_url}
                    alt={result.user.login}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-primary"
                />
             </div>
            <DialogTitle className="text-white text-2xl">{result.user.name || result.user.login}</DialogTitle>
            <DialogDescription className="text-gray-300">@{result.user.login}</DialogDescription>
          </DialogHeader>
          <div className="my-6 text-center">
            <p className="text-gray-400 text-sm">ROAST SCORE</p>
            <p className="text-7xl font-bold text-primary">{result.score}</p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <p className="text-gray-200 italic leading-snug">"{result.roast}"</p>
          </div>
        </div>
        <DialogDescription className="text-center mt-4 text-gray-400">
            Screenshot this card and share your glorious roast!
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
