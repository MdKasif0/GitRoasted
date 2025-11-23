// src/components/ShareableCardPreview.tsx
import React, { forwardRef } from 'react';
import Image from 'next/image';
import type { RoastResultState } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { CardFormat, BackgroundStyle, LayoutStyle, CardTheme } from './ShareableCard';
import { FlameIcon, GithubIcon } from './icons';

interface ShareableCardPreviewProps {
  result: RoastResultState;
  format: CardFormat;
  theme: CardTheme;
  backgroundStyle: BackgroundStyle;
  layout: LayoutStyle;
  showRoast: boolean;
  showStats: boolean;
  showLogo: boolean;
  watermark: boolean;
  customMessage: string;
}

const formatDimensions: Record<CardFormat, { width: number; height: number; className: string }> = {
  instagram: { width: 1080, height: 1080, className: 'aspect-square' },
  twitter: { width: 1200, height: 675, className: 'aspect-[16/9]' },
  portrait: { width: 1080, height: 1440, className: 'aspect-[3/4]' },
};

export const ShareableCardPreview = forwardRef<HTMLDivElement, ShareableCardPreviewProps>(
  (
    {
      result,
      format,
      theme,
      backgroundStyle,
      layout,
      showRoast,
      showStats,
      showLogo,
      watermark,
      customMessage,
    },
    ref
  ) => {
    if (result.status !== 'success' || !result.user || !result.score) {
      return null;
    }

    const { user, score, roast } = result;
    const { className } = formatDimensions[format];
    const scoreToDisplay = Math.round(score / 10);

    const isDark =
      theme === 'dark' ||
      (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
    const headingColor = isDark ? 'text-white' : 'text-black';
    const mutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const cardBgColor = isDark ? 'bg-black/20' : 'bg-white/20';

    return (
      <div
        ref={ref}
        style={{
            width: '540px' // A fixed base width for previewing, aspect ratio will handle height
        }}
        className={cn(
          'p-12 flex flex-col',
          'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white', // default dark theme bg
          className
        )}
      >
        <header className="flex items-start justify-between w-full">
            {showLogo && (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FlameIcon className="w-10 h-10 text-primary" />
                    </div>
                    <span className={`text-3xl font-bold ${headingColor}`}>GitRoasted</span>
                </div>
            )}
            <div className="flex-shrink-0">
                <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-primary shadow-lg"
                />
            </div>
        </header>

        <div className="flex-1 flex flex-col justify-center items-center text-center my-8">
            <h1 className={`text-5xl font-bold ${headingColor}`}>{user.name || user.login}</h1>
            <p className={`text-2xl ${mutedColor}`}>@{user.login}</p>
            
            <div className="relative my-10">
                <p className={`text-sm absolute -top-4 left-1/2 -translate-x-1/2 ${mutedColor} tracking-widest`}>ROAST SCORE</p>
                <p className="text-9xl font-bold text-primary" style={{filter: 'drop-shadow(0 0 15px hsl(var(--primary)))'}}>
                    {score}
                </p>
            </div>

            {showRoast && (
                <div className={`w-full max-w-lg p-6 rounded-xl ${cardBgColor} backdrop-blur-sm border border-white/10`}>
                    <p className={`italic ${textColor} text-xl leading-snug`}>"{roast}"</p>
                </div>
            )}
        </div>

        {watermark && (
            <footer className={`w-full text-center mt-auto ${mutedColor} text-lg`}>
                <p>Generated at GitRoasted.app</p>
            </footer>
        )}
      </div>
    );
  }
);

ShareableCardPreview.displayName = 'ShareableCardPreview';
