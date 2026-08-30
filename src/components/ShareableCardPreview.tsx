import React, { forwardRef } from 'react';
import Image from 'next/image';
import type { RoastResultState } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { CardFormat, BackgroundStyle, LayoutStyle, CardTheme } from './ShareableCardDialog';
import { FlameIcon } from './icons';
import { Trophy, Sparkles, Building, Leaf } from 'lucide-react';

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

const formatDimensions: Record<CardFormat, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  twitter: { width: 1200, height: 675 },
  portrait: { width: 1080, height: 1440 },
};

const getScoreCelebration = (score: number) => {
    const invertedScore = 1000 - score;
    const percentage = invertedScore / 10;
    
    if (percentage >= 90) return { text: 'Git Legend!', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    if (percentage >= 75) return { text: 'Star Developer!', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    if (percentage >= 50) return { text: 'Keep Building!', icon: Building, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { text: 'Every Expert Started Here!', icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
};

export const ShareableCardPreview = forwardRef<HTMLDivElement, ShareableCardPreviewProps>(
  (
    {
      result,
      format,
      theme, // Kept for interface compatibility, but we enforce the dark/orange aesthetic
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
    const invertedScore = 1000 - score;
    const celebration = getScoreCelebration(score);
    const BadgeIcon = celebration.icon;

    // Use width / 60 as base font size for scaling
    // For 1080, 1em = 18px
    const baseFontSize = width / 60;

    return (
      <div
        ref={ref}
        style={{
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${baseFontSize}px`,
            backgroundColor: '#050505',
            color: '#F5F5F5',
        }}
        className="flex flex-col relative overflow-hidden font-sans box-border"
      >
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[40em] h-[40em] bg-[#FF8A00] rounded-full blur-[20em] opacity-[0.05]" />
        <div className="absolute bottom-0 left-0 w-[30em] h-[30em] bg-[#FF8A00] rounded-full blur-[15em] opacity-[0.05]" />
        
        {/* Faint dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Inner Card Container */}
        <div className={cn(
            "relative z-10 w-full h-full flex flex-col p-[3.5em]",
            layout === 'compact' && 'p-[2.5em]',
            layout === 'spacious' && 'p-[4.5em]'
        )}>
            {/* Top Bar: Brand & Logo */}
            {showLogo && (
                <div className="flex items-center gap-[0.5em] mb-[2em] shrink-0">
                    <FlameIcon className="w-[1.2em] h-[1.2em] text-[#FF8A00]" />
                    <span className="text-[0.9em] font-bold tracking-[0.2em] text-[#FF8A00]">GITROASTED</span>
                </div>
            )}
            
            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex",
                format === 'twitter' ? 'flex-row items-center gap-[4em]' : 'flex-col justify-center'
            )}>
                
                {/* Column 1: Profile & Score */}
                <div className={cn(
                    "flex flex-col",
                    format === 'twitter' ? 'w-5/12 shrink-0' : 'items-center text-center'
                )}>
                    {/* Avatar */}
                    <div className="relative mb-[1.5em]">
                        <Image
                            src={user.avatar_url}
                            alt={user.login}
                            width={160}
                            height={160}
                            className={cn(
                                "rounded-full border-[0.25em] border-[#FF8A00] object-cover bg-[#0A0A0A]",
                                layout === 'compact' && 'w-[5em] h-[5em]',
                                layout === 'balanced' && 'w-[7em] h-[7em]',
                                layout === 'spacious' && 'w-[9em] h-[9em]'
                            )}
                        />
                    </div>
                    
                    {/* Name & Handle */}
                    <div className="mb-[2.5em]">
                        <h1 className={cn(
                            "font-bold leading-none mb-[0.2em] text-[#F5F5F5]",
                            layout === 'compact' && 'text-[2em]',
                            layout === 'balanced' && 'text-[2.6em]',
                            layout === 'spacious' && 'text-[3.2em]'
                        )}>
                            {user.name || user.login}
                        </h1>
                        <p className={cn(
                            "text-[#8B949E]",
                            layout === 'compact' && 'text-[1.1em]',
                            layout === 'balanced' && 'text-[1.3em]',
                            layout === 'spacious' && 'text-[1.5em]'
                        )}>
                            @{user.login}
                        </p>
                    </div>

                    {/* Score Area */}
                    <div className={cn("flex flex-col", format !== 'twitter' && 'items-center')}>
                        <div className="text-[0.8em] font-bold tracking-widest text-[#8B949E] uppercase mb-[0.5em]">
                            Seriousness Score
                        </div>
                        <div className="flex items-baseline gap-[0.2em] mb-[1em]">
                            <span className={cn(
                                "font-bold text-[#FF8A00] leading-none",
                                layout === 'compact' && 'text-[3.5em]',
                                layout === 'balanced' && 'text-[4.5em]',
                                layout === 'spacious' && 'text-[5.5em]'
                            )}>
                                {Math.round(invertedScore)}
                            </span>
                            <span className={cn(
                                "font-bold text-[#8B949E]",
                                layout === 'compact' && 'text-[1.5em]',
                                layout === 'balanced' && 'text-[2em]',
                                layout === 'spacious' && 'text-[2.5em]'
                            )}>
                                / 1000
                            </span>
                        </div>
                        
                        {/* Archetype / Badge */}
                        <div className={cn(
                            "flex items-center gap-[0.5em] px-[0.8em] py-[0.4em] rounded-full border border-white/10 bg-white/5",
                            format === 'twitter' && 'self-start'
                        )}>
                            <BadgeIcon className={cn("w-[1em] h-[1em]", celebration.color)} />
                            <span className={cn("text-[0.8em] font-semibold tracking-wide uppercase", celebration.color)}>
                                {celebration.text}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Column 2 / Row 2: Roast & Stats */}
                <div className={cn(
                    "flex flex-col",
                    format === 'twitter' 
                        ? 'flex-1 border-l border-white/10 pl-[4em] justify-center' 
                        : 'mt-[3em] items-center border-t border-white/10 pt-[3em]'
                )}>
                    {/* Roast Quote */}
                    {showRoast && (
                        <div className={cn(
                            "relative pl-[1.5em] border-l-[4px] border-[#FF8A00]",
                            format !== 'twitter' && 'max-w-[35em]'
                        )}>
                            <p className={cn(
                                "font-serif italic leading-relaxed text-[#D1D5DB]",
                                layout === 'compact' && 'text-[1.2em]',
                                layout === 'balanced' && 'text-[1.5em]',
                                layout === 'spacious' && 'text-[1.8em]'
                            )}>
                                "{result.leaderboardRoast}"
                            </p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    {showStats && (
                        <div className={cn(
                            "grid grid-cols-2 mt-[3em]",
                            format === 'twitter' ? 'gap-x-[4em] gap-y-[1.5em]' : 'gap-x-[6em] gap-y-[2em] w-full max-w-[35em]'
                        )}>
                            <div className="flex flex-col">
                                <span className="font-mono text-[1.4em] font-bold text-[#F5F5F5]">{totalStars ?? 0}</span>
                                <span className="text-[0.8em] font-bold tracking-wider text-[#8B949E] uppercase mt-[0.2em]">Total Stars</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-[1.4em] font-bold text-[#F5F5F5]">{user.public_repos}</span>
                                <span className="text-[0.8em] font-bold tracking-wider text-[#8B949E] uppercase mt-[0.2em]">Public Repos</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-[1.4em] font-bold text-[#F5F5F5]">{user.followers}</span>
                                <span className="text-[0.8em] font-bold tracking-wider text-[#8B949E] uppercase mt-[0.2em]">Followers</span>
                            </div>
                            {topLanguages?.[0] && (
                                <div className="flex flex-col">
                                    <span className="font-mono text-[1.4em] font-bold text-[#F5F5F5]">{topLanguages[0][0]}</span>
                                    <span className="text-[0.8em] font-bold tracking-wider text-[#8B949E] uppercase mt-[0.2em]">Top Language</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Footer / Watermark */}
            {(customMessage || watermark) && (
                <div className={cn(
                    "shrink-0 flex items-center justify-between w-full mt-[3em] pt-[2em]",
                    !showLogo && 'border-t border-white/10'
                )}>
                    {customMessage ? (
                        <p className="text-[1em] text-[#8B949E] font-medium">{customMessage}</p>
                    ) : (
                        <div />
                    )}
                    
                    {watermark && (
                        <p className="text-[0.9em] font-medium tracking-wide text-[#8B949E]">
                            gitroasted.netlify.app
                        </p>
                    )}
                </div>
            )}
            
        </div>
      </div>
    );
  }
);

ShareableCardPreview.displayName = 'ShareableCardPreview';
