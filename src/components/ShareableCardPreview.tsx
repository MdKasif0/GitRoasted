// src/components/ShareableCardPreview.tsx
import React, { forwardRef } from 'react';
import Image from 'next/image';
import type { RoastResultState } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { CardFormat, BackgroundStyle, LayoutStyle, CardTheme } from './ShareableCardDialog';
import { Star, Users, Package, Languages } from 'lucide-react';

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

const StatItem = ({ icon: Icon, label, value, layout }: { icon: React.ElementType, label: string, value: string | number, layout: LayoutStyle }) => (
    <div className={cn(
        "flex items-center gap-2 text-left",
        layout === 'compact' && 'gap-1',
        layout === 'spacious' && 'gap-3'
    )}>
        <Icon className={cn(
            "w-[1.2em] h-[1.2em] text-primary shrink-0",
            layout === 'compact' && 'w-[1.1em] h-[1.1em]',
            layout === 'spacious' && 'w-[1.3em] h-[1.3em]'
        )} />
        <div>
            <p className={cn(
                "text-[1.2em] font-bold leading-tight",
                layout === 'compact' && 'text-[1.1em]',
                layout === 'spacious' && 'text-[1.3em]'
            )}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
            <p className={cn(
                "text-[0.8em] text-muted-foreground leading-tight",
                 layout === 'compact' && 'text-[0.75em]',
                 layout === 'spacious' && 'text-[0.85em]'
            )}>{label}</p>
        </div>
    </div>
)

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
    if (result.status !== 'success' || !result.user || !result.score || !result.breakdown) {
      return null;
    }

    const { user, score, roast, totalStars, topLanguages } = result;
    const { width, height } = formatDimensions[format];

    const isDark =
      theme === 'dark' ||
      (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const invertedScore = 1000 - score;

    const baseStyles = {
        '--background': isDark ? '240 10% 3.9%' : '0 0% 100%',
        '--foreground': isDark ? '210 40% 98%' : '240 10% 3.9%',
        '--card': isDark ? '240 10% 10%' : '0 0% 96%',
        '--card-foreground': isDark ? '210 40% 98%' : '240 10% 3.9%',
        '--popover': isDark ? '240 10% 3.9%' : '0 0% 100%',
        '--popover-foreground': isDark ? '210 40% 98%' : '240 10% 3.9%',
        '--primary': '33 100% 50%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': isDark ? '289 68% 45%' : '240 4.8% 95.9%',
        '--secondary-foreground': isDark ? '210 40% 98%' : '240 5.9% 10%',
        '--muted': isDark ? '289 68% 20%' : '240 4.8% 95.9%',
        '--muted-foreground': isDark ? '215 20.2% 65.1%' : '240 3.8% 46.1%',
        '--accent': isDark ? '289 68% 37%' : '240 4.8% 95.9%',
        '--accent-foreground': isDark ? '210 40% 98%' : '240 5.9% 10%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': isDark ? '289 68% 20%' : '240 5.9% 90%',
        '--input': isDark ? '235 50% 30%' : '240 5.9% 90%',
        '--ring': '33 100% 50%',
    } as React.CSSProperties;

    const baseFontSize = width / 60;

    return (
      <div
        ref={ref}
        style={{
            ...baseStyles,
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${baseFontSize}px`,
        }}
        className={cn(
          'p-[3em] flex flex-col items-center justify-center font-sans',
          'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
          'relative overflow-hidden'
        )}
      >
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(at 27% 37%, hsla(273,81%,63%,${isDark ? '0.15' : '0.1'}) 0px, transparent 50%), radial-gradient(at 77% 30%, hsla(202,68%,73%,${isDark ? '0.15' : '0.1'}) 0px, transparent 50%), radial-gradient(at 50% 100%, hsla(303,81%,63%,${isDark ? '0.15' : '0.1'}) 0px, transparent 50%)`
          }}
        ></div>
        
        <div className={cn(
            "z-10 w-full h-full flex flex-col items-center text-center p-[2em] bg-[hsl(var(--card))]/30 backdrop-blur-2xl border border-[hsl(var(--border))] rounded-3xl",
            layout === 'compact' && 'p-[1.5em] justify-around',
            layout === 'balanced' && 'p-[2em] justify-center',
            layout === 'spacious' && 'p-[2.5em] justify-between'
        )}>

            <div className="relative">
                 <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={96}
                    height={96}
                    className={cn(
                        "rounded-full border-4 border-primary shadow-lg",
                        layout === 'compact' && 'w-[5em] h-[5em]',
                        layout === 'balanced' && 'w-[6em] h-[6em]',
                        layout === 'spacious' && 'w-[7em] h-[7em]'
                    )}
                />
            </div>
            
            <div>
                <h1 className={cn(
                    `font-bold leading-none`,
                    layout === 'compact' && 'text-[2.2em] mt-2',
                    layout === 'balanced' && 'text-[2.5em] mt-4',
                    layout === 'spacious' && 'text-[2.8em] mt-2'
                )}>{user.name || user.login}</h1>
                <p className={cn(
                    `text-[hsl(var(--muted-foreground))]`,
                    layout === 'compact' && 'text-[1em]',
                    layout === 'balanced' && 'text-[1.2em]',
                    layout === 'spacious' && 'text-[1.4em]'
                )}>@{user.login}</p>
            </div>
            
            <div className={cn(
                "relative my-6",
                layout === 'compact' && 'w-[10em] h-[10em] my-2',
                layout === 'balanced' && 'w-[12em] h-[12em] my-6',
                layout === 'spacious' && 'w-[14em] h-[14em] my-4'
            )}>
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    <defs>
                        <linearGradient id="share-card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="50%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="56" fill="none" stroke="hsl(var(--border))" strokeWidth="6"/>
                    <circle
                        cx="60"
                        cy="60"
                        r="56"
                        fill="none"
                        stroke="url(#share-card-gradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={352}
                        strokeDashoffset={352 * (1 - invertedScore / 1000)}
                        className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={cn(
                        "font-bold text-primary",
                        layout === 'compact' && 'text-[3em]',
                        layout === 'balanced' && 'text-[3.5em]',
                        layout === 'spacious' && 'text-[4em]'
                    )}>{Math.round(invertedScore)}</p>
                    <p className={cn(
                        "text-[hsl(var(--muted-foreground))] -mt-2",
                         layout === 'compact' && 'text-[0.9em]',
                         layout === 'balanced' && 'text-[1em]',
                         layout === 'spacious' && 'text-[1.1em]'
                    )}>/ 1000</p>
                </div>
            </div>

            {showRoast && (
                <div className={cn(
                    "italic text-[hsl(var(--muted-foreground))] max-w-md",
                    layout === 'compact' && 'text-[1em]',
                    layout === 'balanced' && 'text-[1.1em]',
                    layout === 'spacious' && 'text-[1.2em]'
                )}>
                   <p>"{result.leaderboardRoast}"</p>
                </div>
            )}
            
            {showStats && (
                <div className={cn(
                    "grid grid-cols-2 mt-8",
                    layout === 'compact' && 'gap-x-6 gap-y-2',
                    layout === 'balanced' && 'gap-x-8 gap-y-4',
                    layout === 'spacious' && 'gap-x-12 gap-y-6'
                )}>
                    <StatItem icon={Star} label="Total Stars" value={totalStars ?? 0} layout={layout} />
                    <StatItem icon={Users} label="Followers" value={user.followers} layout={layout} />
                    <StatItem icon={Package} label="Public Repos" value={user.public_repos} layout={layout} />
                    {topLanguages?.[0] && <StatItem icon={Languages} label="Top Language" value={topLanguages[0][0]} layout={layout} />}
                </div>
            )}

            {customMessage && (
                <p className={cn("text-[hsl(var(--muted-foreground))] text-center mt-4", layout === 'compact' && 'text-[0.9em]', layout === 'balanced' && 'text-[1em]')}>
                    {customMessage}
                </p>
            )}

            <div className={cn("flex items-center gap-3", layout !== 'spacious' && 'mt-auto')}>
                 {showLogo && (
                    <Image
                        src="/app-icon.png"
                        alt="GitRoasted Logo"
                        width={24}
                        height={24}
                        className={cn(
                            "w-[1.5em] h-[1.5em]",
                            layout === 'compact' && 'w-[1.2em] h-[1.2em]',
                            layout === 'spacious' && 'w-[1.8em] h-[1.8em]'
                        )}
                    />
                 )}
                 {watermark && <p className={cn(
                    "text-[hsl(var(--muted-foreground))]",
                    layout === 'compact' && 'text-[0.9em]',
                    layout === 'balanced' && 'text-[1em]',
                    layout === 'spacious' && 'text-[1.1em]'
                )}>GitRoasted.app</p>}
            </div>

        </div>
      </div>
    );
  }
);

ShareableCardPreview.displayName = 'ShareableCardPreview';
