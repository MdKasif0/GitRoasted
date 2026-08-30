'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import {
  Copy,
  Download,
  Share2,
  X,
  Minus,
  Plus
} from 'lucide-react';

import type { RoastResultState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ShareableCardPreview } from './ShareableCardPreview';
import { CustomizationPanel } from './CustomizationPanel';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { FlameIcon } from './icons';

interface ShareableCardDialogProps {
  result: RoastResultState;
}

export type CardFormat = 'instagram' | 'twitter' | 'portrait';
export type CardTheme = 'light' | 'dark' | 'auto';
export type BackgroundStyle = 'gradient' | 'solid' | 'pattern' | 'blur';
export type LayoutStyle = 'compact' | 'balanced' | 'spacious';

export function ShareableCardDialog({ result }: ShareableCardDialogProps) {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const [format, setFormat] = useState<CardFormat>('instagram');
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('gradient');
  const [layout, setLayout] = useState<LayoutStyle>('balanced');
  const [showRoast, setShowRoast] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [previewSize, setPreviewSize] = useState(100);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    if (navigator.share === undefined) {
      toast({
        variant: 'destructive',
        title: 'Unsupported',
        description: 'Your browser does not support the Web Share API.',
      });
      return;
    }

    try {
       const blob = await htmlToImage.toBlob(cardRef.current!, { pixelRatio: 2 });
       if(!blob) throw new Error('Could not create blob.');

       const file = new File([blob], `gitroasted-card-${result.user?.login}.png`, { type: 'image/png' });

       await navigator.share({
        title: `My GitRoasted Card for ${result.user?.login}`,
        text: `Check out my GitRoasted score! Can you beat it? #GitRoasted`,
        files: [file]
      });
    } catch (err: any) {
        if(err.name !== 'AbortError') {
            console.error('Failed to share image', err);
            toast({
                variant: 'destructive',
                title: 'Uh oh!',
                description: 'Something went wrong while trying to share.',
            });
        }
    }
  }, [result.user?.login, toast]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      if (!blob) {
          throw new Error('Could not generate image blob.');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `gitroasted-card-${result.user?.login}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success!',
        description: 'Your GitRoasted card is downloading.',
      });

    } catch (err) {
      console.error('Failed to download image', err);
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Could not download the card. Please try again.',
      });
    }
  }, [result.user?.login, toast]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!cardRef.current) return;
    if(navigator.clipboard === undefined || !navigator.clipboard.write) {
        toast({
            variant: 'destructive',
            title: 'Unsupported',
            description: 'Your browser does not support copying images to the clipboard.',
        });
        return;
    }

    try {
      const blob = await htmlToImage.toBlob(cardRef.current, { pixelRatio: 2 });
      if (!blob) throw new Error('Could not create blob.');
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      toast({
        title: 'Copied to Clipboard!',
        description: 'You can now paste the card in any application.',
      });
    } catch (err) {
      console.error('Failed to copy image', err);
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Could not copy the card. Please try again.',
      });
    }
  }, [cardRef, toast]);

  if (result.status !== 'success' || !result.user) {
    return null;
  }

  const getFormatLabel = (fmt: CardFormat) => {
      switch(fmt) {
          case 'instagram': return 'Instagram Post (1:1)';
          case 'twitter': return 'X / Twitter (16:9)';
          case 'portrait': return 'Portrait (3:4)';
      }
  }
  const getFormatDim = (fmt: CardFormat) => {
      switch(fmt) {
          case 'instagram': return '1080 × 1080 px';
          case 'twitter': return '1200 × 675 px';
          case 'portrait': return '1080 × 1440 px';
      }
  }

  // Adjust preview scaling to fit the container
  const scale = (isMobile ? previewSize * 0.5 : previewSize) / 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-[#050505] font-semibold h-10 px-6 rounded-lg transition-colors shadow-none border-none">
            <Share2 className="mr-2 h-4 w-4" />
            Share Roast
        </Button>
      </DialogTrigger>
      
      {/* Custom, borderless, fully controlled DialogContent */}
      <DialogContent 
        className="max-w-[1250px] max-h-[90vh] w-full p-0 flex flex-col bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        style={{ '--radius': '0.75rem' } as React.CSSProperties}
        hideCloseButton // assuming you have or can add a hideCloseButton prop, or we just position ours over it. Next.js dialog might require CSS to hide default.
      >
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between p-6 pb-4 shrink-0">
          <div className="flex items-start gap-4">
             <FlameIcon className="w-6 h-6 text-orange-500 mt-1" />
             <div>
                <h2 className="text-xl font-bold text-white mb-1">Share your roast</h2>
                <p className="text-sm text-muted-foreground font-medium">Create a card worth posting.</p>
             </div>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-white/10 text-muted-foreground transition-colors"
          >
              <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_400px] overflow-hidden flex-1 border-y border-white/5">
          
          {/* PREVIEW STAGE */}
          <div className="bg-[#080808] relative flex flex-col">
              {/* LIVE PREVIEW Badge */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Live Preview
              </div>

              {/* Centered Card Canvas */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative">
                 {/* Faint background glow behind the card */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
                 
                 <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                  className="transition-transform duration-300 relative z-10 shadow-2xl"
                >
                    <ShareableCardPreview
                        ref={cardRef}
                        result={result}
                        format={format}
                        theme={theme}
                        backgroundStyle={backgroundStyle}
                        layout={layout}
                        showRoast={showRoast}
                        showStats={showStats}
                        showLogo={showLogo}
                        watermark={watermark}
                        customMessage={customMessage}
                    />
                 </div>
              </div>

              {/* Bottom Preview Metadata & Zoom */}
              <div className="h-16 border-t border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#080808]">
                 <div className="flex items-center gap-8">
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-muted-foreground">
                             <Copy className="w-4 h-4" /> {/* Format icon placeholder */}
                         </div>
                         <div>
                             <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Format</div>
                             <div className="text-xs font-medium text-white/90">{getFormatLabel(format)}</div>
                         </div>
                     </div>
                     <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-8">
                         <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-muted-foreground">
                             <Copy className="w-4 h-4" /> {/* Size icon placeholder */}
                         </div>
                         <div>
                             <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Size</div>
                             <div className="text-xs font-medium text-white/90">{getFormatDim(format)}</div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Zoom Controls */}
                 <div className="flex items-center gap-1 bg-white/5 rounded-md p-1 border border-white/10">
                     <button onClick={() => setPreviewSize(Math.max(10, previewSize - 10))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-muted-foreground transition-colors"><Minus className="w-3 h-3" /></button>
                     <div className="text-[11px] font-mono text-white/80 w-12 text-center">{previewSize}%</div>
                     <button onClick={() => setPreviewSize(Math.min(200, previewSize + 10))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-muted-foreground transition-colors"><Plus className="w-3 h-3" /></button>
                     <div className="w-px h-4 bg-white/10 mx-1" />
                     <button onClick={() => setPreviewSize(100)} className="px-3 h-7 flex items-center justify-center rounded hover:bg-white/10 text-[11px] font-medium text-white/80 transition-colors">Fit</button>
                 </div>
              </div>
          </div>

          {/* CUSTOMIZATION PANEL */}
          <CustomizationPanel
            format={format}
            setFormat={setFormat}
            theme={theme}
            setTheme={setTheme}
            backgroundStyle={backgroundStyle}
            setBackgroundStyle={setBackgroundStyle}
            layout={layout}
            setLayout={setLayout}
            showRoast={showRoast}
            setShowRoast={setShowRoast}
            showStats={showStats}
            setShowStats={setShowStats}
            showLogo={showLogo}
            setShowLogo={setShowLogo}
            watermark={watermark}
            setWatermark={setWatermark}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
            previewSize={previewSize}
            setPreviewSize={setPreviewSize}
            onDownload={handleDownload}
            onCopyToClipboard={handleCopyToClipboard}
            onShare={handleShare}
          />
        </div>

        {/* --- ACTION BAR FOOTER --- */}
        <div className="p-6 bg-[#0A0A0A] flex items-center justify-between shrink-0">
             <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="bg-transparent border-white/10 text-white hover:bg-white/5 h-11 px-6 rounded-lg font-semibold shadow-none"
             >
                 Cancel
             </Button>

             <div className="flex items-center gap-3">
                 <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="bg-transparent border-white/10 text-white hover:bg-white/5 h-11 px-6 rounded-lg font-semibold shadow-none"
                 >
                     <Share2 className="w-4 h-4 mr-2" /> Share Card
                 </Button>
                 <Button 
                    onClick={handleDownload}
                    className="bg-orange-500 hover:bg-orange-600 text-[#050505] h-11 px-6 rounded-lg font-bold shadow-none"
                 >
                     <Download className="w-4 h-4 mr-2" /> Download Card
                 </Button>
             </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
