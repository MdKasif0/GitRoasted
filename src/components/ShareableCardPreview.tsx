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
    const percentage = Math.round((invertedScore / 1000) * 100);

    const getScoreCelebration = (s: number) => {
        const inv = 1000 - s;
        const pct = inv / 10;
        if (pct >= 90) return 'Git Legend!';
        if (pct >= 75) return 'Star Developer!';
        if (pct >= 50) return 'Keep Building!';
        return 'Rising Developer';
    };

    // Calculate dynamic base font size based on format width to keep scaling consistent
    const baseFontSize = width / 100; // 1em = 1% of width

    // Icon helper since lucide-react might not scale perfectly with ems in some older setups, but it usually does.
    const FlameIcon = ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
    );

    const totalContributions = result.events?.filter(e => e.type === 'PushEvent').length || 0;

    return (
      <div
        ref={ref}
        style={{
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${baseFontSize}px`,
            backgroundColor: isDark ? '#050505' : '#ffffff',
            color: isDark ? '#ffffff' : '#050505',
        }}
        className={cn(
          'p-[4em] flex flex-col items-center justify-center font-sans relative overflow-hidden',
          theme === 'light' ? 'light-mode-card' : ''
        )}
      >
        {/* Glow behind the card within the export area if we want, but usually it's just solid black for the card itself. The prompt says "card generated itself should feel like a premium artifact". Let's make the card edge-to-edge dark. */}
        <div 
            className="absolute inset-[3em] rounded-[2em] border border-[#FF8A00]/20 bg-[#0A0A0A] overflow-hidden flex flex-col"
            style={{ 
                boxShadow: 'inset 0 0 100px rgba(255,138,0,0.02), 0 20px 40px rgba(0,0,0,0.5)',
                backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA',
                borderColor: isDark ? 'rgba(255,138,0,0.2)' : 'rgba(255,138,0,0.3)'
            }}
        >
            {/* Subtle dotted pattern at bottom corners */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `radial-gradient(#FF8A00 1px, transparent 1px)`,
                backgroundSize: '1.5em 1.5em',
                maskImage: 'linear-gradient(to top right, black, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to top right, black, transparent 40%)'
            }} />
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `radial-gradient(#FF8A00 1px, transparent 1px)`,
                backgroundSize: '1.5em 1.5em',
                maskImage: 'linear-gradient(to top left, black, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to top left, black, transparent 40%)'
            }} />

            <div className={cn(
                "relative z-10 w-full h-full flex flex-col p-[4em]",
                layout === 'compact' && 'p-[3em]',
                layout === 'spacious' && 'p-[5em]'
            )}>
                
                {/* Header Section */}
                <div className="flex justify-between items-start w-full">
                    
                    {/* Left Column: Brand, Name, Score */}
                    <div className="flex flex-col items-start">
                        {showLogo && (
                            <div className="flex items-center gap-[0.5em] text-[#FF8A00] font-bold tracking-[0.2em] uppercase text-[1.2em]">
                                <FlameIcon className="w-[1.2em] h-[1.2em]" /> 
                                <span>GITROASTED</span>
                            </div>
                        )}

                        <div className={cn("mt-[3em]", !showLogo && "mt-0")}>
                            <h1 className="text-[4em] font-bold leading-tight tracking-tight" style={{ color: isDark ? '#FFFFFF' : '#050505' }}>{user.name || user.login}</h1>
                            <p className="text-[2em] font-medium" style={{ color: isDark ? '#8B949E' : '#666666' }}>@{user.login}</p>
                        </div>

                        <div className="mt-[3em]">
                            <h2 className="text-[1.1em] text-[#FF8A00] uppercase tracking-[0.2em] font-bold mb-[0.5em]">Seriousness Score</h2>
                            <div className="flex items-baseline gap-[0.3em]">
                                <span className="text-[6em] font-bold text-[#FF8A00] leading-none tracking-tighter">{Math.round(invertedScore)}</span>
                                <span className="text-[2em]" style={{ color: isDark ? '#8B949E' : '#666666' }}>/ 1000</span>
                            </div>
                            <div className="mt-[1.5em] inline-flex items-center gap-[0.6em] border border-[#FF8A00]/30 rounded-full px-[1.2em] py-[0.6em] text-[#FF8A00] text-[1em] uppercase font-bold tracking-[0.1em] bg-[#FF8A00]/10">
                                <FlameIcon className="w-[1.2em] h-[1.2em]" /> 
                                <span>{getScoreCelebration(score)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Avatar, Circular Gauge */}
                    <div className="flex flex-col items-end pt-[1em]">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-[#FF8A00] blur-xl opacity-30" />
                            <Image
                                src={user.avatar_url}
                                alt={user.login}
                                width={200}
                                height={200}
                                className="w-[9em] h-[9em] rounded-full border-[0.3em] border-[#FF8A00] relative z-10"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        <div className="w-[11em] h-[11em] relative mt-[4em] mr-[1em]">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="8"/>
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="#FF8A00"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={339.29}
                                    strokeDashoffset={339.29 * (1 - (percentage / 100))}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[2.5em] font-bold leading-none text-[#FF8A00]">{percentage}%</span>
                                <span className="text-[1.1em] font-medium mt-[0.2em]" style={{ color: isDark ? '#8B949E' : '#666666' }}>serious</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roast Quote */}
                {showRoast && (
                    <div className="mt-[4em] border-t border-white/10 pt-[3em] w-full text-left flex-1 flex flex-col justify-center">
                        <p className="text-[2em] italic font-serif leading-relaxed" style={{ color: isDark ? '#A1A1AA' : '#555555' }}>
                            "{result.leaderboardRoast || result.roast?.split('\n')[0] || "Your code is a cosmic joke."}"
                        </p>
                    </div>
                )}

                {/* Stats Row */}
                {showStats && (
                    <div className={cn(
                        "mt-auto pt-[4em] flex items-center justify-between w-full",
                        !showRoast && "pt-[6em]"
                    )}>
                        <StatItem icon={Star} label="Total Stars" value={totalStars ?? 0} layout={layout} isDark={isDark} />
                        <StatItem icon={Package} label="Public Repos" value={user.public_repos} layout={layout} isDark={isDark} />
                        <StatItem icon={Users} label="Followers" value={user.followers} layout={layout} isDark={isDark} />
                        <StatItem icon={FlameIcon} label="Commits (yr)" value={totalContributions} layout={layout} isDark={isDark} />
                        {topLanguages?.[0] && <StatItem icon={Languages} label="Top Languages" value={topLanguages.length} layout={layout} isDark={isDark} />}
                    </div>
                )}

            </div>
        </div>
      </div>
    );
  }
);

ShareableCardPreview.displayName = 'ShareableCardPreview';
