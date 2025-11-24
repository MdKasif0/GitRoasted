// src/components/ShareableCardDialog.tsx
'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import {
  Copy,
  Download,
  Share2,
} from 'lucide-react';

import type { RoastResultState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ShareableCardPreview } from './ShareableCardPreview';
import { CustomizationPanel } from './CustomizationPanel';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';

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

  const [format, setFormat] = useState<CardFormat>('instagram');
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('gradient');
  const [layout, setLayout] = useState<LayoutStyle>('balanced');
  const [showRoast, setShowRoast] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [previewSize, setPreviewSize] = useState(60);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2, // Higher pixel ratio for better quality
      });

      if (isMobile) {
        // On mobile, open the image in a new tab for the user to save.
        const newWindow = window.open();
        newWindow?.document.write(`<img src="${dataUrl}" alt="GitRoasted Card" style="max-width: 100%; height: auto;" />`);
      } else {
        // On desktop, trigger a direct download.
        const link = document.createElement('a');
        link.download = `gitroasted-card-${result.user?.login}.png`;
        link.href = dataUrl;
        link.click();
      }

      toast({
        title: 'Success!',
        description: isMobile ? 'Card opened. You can now save the image.' : 'Your GitRoasted card has been downloaded.',
      });
    } catch (err) {
      console.error('Failed to download image', err);
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Could not download the card. Please try again.',
      });
    }
  }, [cardRef, result.user?.login, toast, isMobile]);

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

  const handleShare = useCallback(async () => {
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


  if (result.status !== 'success' || !result.user) {
    return null;
  }

  const formatOptions: { value: CardFormat; label: string }[] = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'portrait', label: '3:4' },
  ]
  const shareUrl = "https://gitroasted.app";
  const shareText = `I got a seriousness score of ${1000 - (result.score || 0)}/1000 on GitRoasted! 🔥 ${result.leaderboardRoast} Check your GitHub profile:`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full hover:scale-105 transition-transform bg-gradient-to-r from-purple-600 to-pink-500">
            <Share2 className="mr-2 h-4 w-4" />
            Share Your Card
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "p-0 overflow-hidden",
        isMobile ? "max-w-[100vw] h-[100svh] sm:h-[90svh] sm:max-w-md rounded-none sm:rounded-lg" : "max-w-6xl h-[90vh]"
      )}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Share Your GitRoasted Card</DialogTitle>
        </DialogHeader>

        {isMobile ? (
          <div className="flex flex-col h-full bg-background p-4 gap-4">
              <div className='flex items-center justify-center gap-2'>
                {formatOptions.map(({value, label}) => (
                    <Button key={value} onClick={() => setFormat(value)} variant={format === value ? 'default' : 'outline'} className={cn('rounded-full transition-all', format === value && 'bg-gradient-to-r from-orange-500 to-purple-500 text-white')}>
                        {label}
                    </Button>
                ))}
              </div>

              <div className='flex-1 flex items-center justify-center overflow-hidden'>
                 <div
                    style={{
                        transform: `scale(0.6)`, // Smaller scale for mobile
                        transformOrigin: 'center center',
                    }}
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

              <div className='flex flex-col gap-3 mt-auto'>
                 <Button size="lg" onClick={handleDownload} className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white">Download as PNG</Button>
                 <Button size="lg" onClick={handleCopyToClipboard} className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white">Copy Image</Button>
                 <Button size="lg" onClick={handleShare} variant="outline" className="w-full h-14 text-lg border-2">Share via...</Button>
              </div>

          </div>
        ) : (
        <div className="grid md:grid-cols-[2fr_1fr] h-[calc(100%-57px)] overflow-hidden">
          {/* Preview Section */}
          <div className="flex items-center justify-center p-8 bg-muted/20 overflow-auto relative">
             <div
              style={{
                transform: `scale(${previewSize / 100})`,
                transformOrigin: 'center center',
              }}
              className="transition-transform duration-300"
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

          {/* Customization Panel */}
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
            shareUrl={shareUrl}
            shareText={shareText}
          />
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
