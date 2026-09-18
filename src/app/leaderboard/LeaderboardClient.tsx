'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Crown,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/types';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useLeaderboard } from '@/context/LeaderboardContext';

type TimeFilter = 'all' | 'month' | 'week';

// Podium item for ranks 1, 2, and 3
function PodiumCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
}) {
  const isFirst = rank === 1;

  return (
    <Collapsible className="w-full">
      <div
        className={cn(
          'relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl transition-all duration-200 border',
          isFirst
            ? 'bg-[#121110] border-[#FF8A00]/70 shadow-[0_0_35px_rgba(255,138,0,0.09)] sm:-translate-y-2 z-10'
            : 'bg-[#0D0C0B] border-[#211F1D] sm:translate-y-2'
        )}
      >
        <CollapsibleTrigger asChild>
          <div className="w-full cursor-pointer flex flex-col items-center">
            {/* Rank badge */}
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-2',
                isFirst
                  ? 'border-2 border-[#FF8A00] text-[#FF8A00] bg-[#1A1510]'
                  : 'border border-[#292623] text-neutral-400 bg-[#171513]'
              )}
            >
              {rank}
            </div>

            {/* Crown for #1 */}
            {isFirst && (
              <Crown className="w-5 h-5 text-[#FF8A00] mb-1 drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]" />
            )}

            {/* Avatar */}
            <div className="relative mb-3 group">
              <Image
                src={entry.avatarUrl}
                alt={entry.username}
                width={isFirst ? 80 : 64}
                height={isFirst ? 80 : 64}
                className={cn(
                  'rounded-full object-cover shadow-lg transition-transform group-hover:scale-105',
                  isFirst
                    ? 'border-2 border-[#FF8A00] shadow-[0_0_16px_rgba(255,138,0,0.25)]'
                    : 'border border-[#292623]'
                )}
              />
            </div>

            {/* Name & Handle */}
            <a
              href={`https://github.com/${entry.username}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-base sm:text-lg font-bold text-white hover:text-[#FF8A00] transition-colors truncate max-w-full px-2"
            >
              {entry.name || entry.username}
            </a>
            <p className="text-xs text-[#71717A] font-mono truncate max-w-full">
              @{entry.username}
            </p>

            {/* Score */}
            <div className="mt-3 flex items-baseline justify-center gap-1 font-mono">
              <span className="text-xl sm:text-2xl font-bold text-[#FF8A00]">
                <AnimatedNumber value={entry.score} />
              </span>
              <span className="text-xs text-[#71717A]">/ 1000</span>
            </div>

            {/* Placement Label */}
            <span
              className={cn(
                'mt-3 text-[10px] font-mono tracking-widest uppercase font-semibold',
                isFirst ? 'text-[#FF8A00]' : 'text-[#71717A]'
              )}
            >
              {isFirst
                ? 'FIRST PLACE'
                : rank === 2
                ? 'SECOND PLACE'
                : 'THIRD PLACE'}
            </span>
          </div>
        </CollapsibleTrigger>

        {/* Expandable Roast */}
        {entry.roast && (
          <CollapsibleContent className="w-full">
            <div className="bg-[#080706] border border-[#292623] p-3.5 mt-4 rounded-xl text-left">
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                &ldquo;{entry.roast}&rdquo;
              </p>
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4 w-full animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="h-64 rounded-2xl bg-[#11100F] border border-[#211F1D]" />
        <div className="h-72 rounded-2xl bg-[#141210] border border-[#292623]" />
        <div className="h-64 rounded-2xl bg-[#11100F] border border-[#211F1D]" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-[#11100F] border border-[#211F1D]"
          />
        ))}
      </div>
    </div>
  );
}

export function LeaderboardClient() {
  const {
    leaderboard,
    loading,
    lastUpdated,
    refreshLeaderboard,
    filterLeaderboard,
    loadMore,
    hasMore,
    totalUsers,
  } = useLeaderboard();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLeaderboardLength = useRef(0);

  const handleRefresh = useCallback(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  useEffect(() => {
    refreshLeaderboard();
  }, [timeFilter, refreshLeaderboard]);

  const filteredData = useMemo(() => {
    return filterLeaderboard(timeFilter, searchTerm);
  }, [timeFilter, searchTerm, filterLeaderboard]);

  // Derive podium entries (top 3)
  const isSearching = searchTerm.trim().length > 0;
  const podiumData = useMemo(() => {
    if (isSearching || filteredData.length < 3) return [];
    return filteredData.slice(0, 3);
  }, [filteredData, isSearching]);

  // Ranked order for podium display: [Rank 2, Rank 1, Rank 3]
  const podiumDisplayOrder = useMemo(() => {
    if (podiumData.length < 3) return [];
    return [
      { entry: podiumData[1], rank: 2 as const },
      { entry: podiumData[0], rank: 1 as const },
      { entry: podiumData[2], rank: 3 as const },
    ];
  }, [podiumData]);

  // Main table entries:
  // If searching: all matching rows are shown with accurate rank
  // If not searching: rows 4+ are shown (ranks 1-3 appear in podium)
  const tableData = useMemo(() => {
    if (isSearching) {
      return filteredData.map((entry) => {
        const actualRank =
          leaderboard.findIndex((e) => e.username === entry.username) + 1;
        return {
          entry,
          rank: actualRank > 0 ? actualRank : 1,
        };
      });
    }
    return filteredData.slice(3).map((entry, idx) => ({
      entry,
      rank: idx + 4,
    }));
  }, [filteredData, isSearching, leaderboard]);

  useEffect(() => {
    if (
      leaderboard.length > prevLeaderboardLength.current &&
      prevLeaderboardLength.current > 0
    ) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
    prevLeaderboardLength.current = leaderboard.length;
  }, [leaderboard.length]);

  return (
    <div className="w-full flex flex-col">
      {/* HEADER SECTION */}
      <header className="mb-8 sm:mb-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#141210] border border-[#292623] flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF8A00]" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#FF8A00] text-xs font-mono font-semibold tracking-widest uppercase mb-1">
              <span>GITROASTED / HALL OF FLAME</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F4]">
              Leaderboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#A1A1AA]">
              See the top-roasted legends and where you stand.
            </p>
          </div>
        </div>
      </header>

      {/* CONTROLS ROW: SEARCH + TIME FILTERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] w-4 h-4" />
          <input
            type="text"
            placeholder="Search username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#11100F] border border-[#292623] text-sm text-[#F5F5F4] placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00] transition-colors"
          />
        </div>

        {/* Time filters segmented control */}
        <div className="flex items-center p-1 rounded-lg bg-[#11100F] border border-[#292623] h-11 shrink-0">
          {(
            [
              { key: 'all', label: 'All Time' },
              { key: 'month', label: 'This Month' },
              { key: 'week', label: 'This Week' },
            ] as const
          ).map(({ key, label }) => {
            const isActive = timeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTimeFilter(key)}
                className={cn(
                  'px-3 sm:px-4 h-full rounded-md text-xs sm:text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#1A1510] text-[#FF8A00] border border-[#FF8A00] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F4]'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* REFRESH & STATUS ROW */}
      <div className="flex items-center gap-3 mb-10 text-xs text-[#71717A]">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading && leaderboard.length > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#11100F] border border-[#292623] hover:border-neutral-600 hover:text-white text-neutral-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={cn('w-3.5 h-3.5 text-neutral-400', loading && 'animate-spin')}
          />
          <span>Refresh</span>
        </button>

        {lastUpdated && (
          <span className="font-mono">
            Last updated:{' '}
            {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
        )}
      </div>

      {/* SKELETON STATE */}
      {loading && leaderboard.length === 0 && <LeaderboardSkeleton />}

      {/* PODIUM SECTION (TOP 3) */}
      {!loading && podiumDisplayOrder.length === 3 && (
        <section aria-labelledby="podium-heading" className="mb-14 sm:mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-[#FF8A00] rounded-full" />
              <div>
                <span
                  id="podium-heading"
                  className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FF8A00] font-semibold uppercase block"
                >
                  HALL OF FLAME
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Top 3 developers
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  The most roasted. The most legendary.
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 flex items-center gap-2">
                <span>LEGENDS GET ROASTED.</span>
                <span className="w-5 h-[2px] bg-[#FF8A00]" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                THE BEST GET BETTER.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-end">
            {podiumDisplayOrder.map(({ entry, rank }) => (
              <PodiumCard key={entry.username} entry={entry} rank={rank} />
            ))}
          </div>
        </section>
      )}

      {/* MAIN RANKING TABLE */}
      {(!loading || leaderboard.length > 0) && (
        <section aria-labelledby="ranking-heading" className="mb-12">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-[#FF8A00] rounded-full" />
            <div>
              <span
                id="ranking-heading"
                className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FF8A00] font-semibold uppercase block"
              >
                ALL DEVELOPERS
              </span>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-0.5">
                See where you stand among{' '}
                <span className="font-mono text-white font-medium">
                  {totalUsers > 0 ? totalUsers.toLocaleString() : filteredData.length}
                </span>{' '}
                developers.
              </p>
            </div>
          </div>

          {/* Table Headers */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[#292623] text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[#71717A] uppercase">
            <div className="flex items-center gap-4">
              <span className="w-10 text-center sm:text-left">RANK</span>
              <span>DEVELOPER</span>
            </div>
            <span>SCORE</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#211F1D]">
            {tableData.map(({ entry, rank }, index) => {
              const isFirstOfNewBatch = index === prevLeaderboardLength.current - 3;

              return (
                <Collapsible key={entry.username}>
                  <div
                    ref={isFirstOfNewBatch ? scrollRef : null}
                    className="group transition-colors hover:bg-[#11100F] rounded-lg"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between px-3 sm:px-4 py-3.5 sm:py-4 cursor-pointer">
                        {/* Left: Rank + Avatar + Name */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-4">
                          {/* Rank */}
                          <span className="w-10 font-mono text-xs sm:text-sm text-neutral-400 font-semibold text-center sm:text-left shrink-0">
                            {rank}
                          </span>

                          {/* Avatar */}
                          <Image
                            src={entry.avatarUrl}
                            alt={entry.username}
                            width={40}
                            height={40}
                            className="rounded-full border border-white/10 shrink-0 object-cover"
                          />

                          {/* Name & Handle */}
                          <div className="min-w-0 flex-1 truncate">
                            <a
                              href={`https://github.com/${entry.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm sm:text-base font-semibold text-white hover:text-[#FF8A00] transition-colors truncate block"
                            >
                              {entry.name || entry.username}
                            </a>
                            <p className="text-xs text-[#71717A] font-mono truncate">
                              @{entry.username}
                            </p>
                          </div>
                        </div>

                        {/* Right: Score + Chevron */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="font-mono text-sm sm:text-base font-bold text-[#FF8A00]">
                            <AnimatedNumber value={entry.score} />
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Expandable Roast Quote */}
                    {entry.roast && (
                      <CollapsibleContent>
                        <div className="bg-[#0D0C0B] border border-[#292623] p-3.5 mx-3 sm:mx-4 mb-3 rounded-lg">
                          <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                            &ldquo;{entry.roast}&rdquo;
                          </p>
                        </div>
                      </CollapsibleContent>
                    )}
                  </div>
                </Collapsible>
              );
            })}
          </div>

          {/* Empty Search Result */}
          {!loading && filteredData.length === 0 && (
            <div className="text-center py-16 px-4 bg-[#0D0C0B] border border-[#211F1D] rounded-xl mt-4">
              <p className="text-base font-semibold text-white mb-1">
                No developers found
              </p>
              <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                {searchTerm
                  ? `No developer accounts matched "${searchTerm}". Try another search term.`
                  : 'The Hall of Flame is empty for this time period.'}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isSearching && (
            <div className="flex flex-col items-center justify-center mt-10">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-lg bg-[#171513] border border-[#292623] hover:border-neutral-600 hover:bg-[#211F1D] text-sm font-medium text-neutral-200 transition-colors disabled:opacity-50"
              >
                {loading && leaderboard.length > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF8A00]" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </>
                )}
              </button>

              <p className="text-xs text-[#71717A] font-mono text-center mt-3">
                Showing {filteredData.length} of {totalUsers} developers.
              </p>
            </div>
          )}

          {!hasMore && filteredData.length > 0 && !isSearching && (
            <p className="text-center text-xs text-[#71717A] font-mono mt-8">
              Showing all {filteredData.length} developers.
            </p>
          )}
        </section>
      )}

      {/* FOOTER BAR */}
      <footer className="w-full border-t border-[#211F1D] pt-8 pb-10 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#71717A]">
          <span className="text-[#FF8A00] font-bold text-sm">GitRoasted</span>
          <span className="uppercase">BRUTAL FEEDBACK. BETTER DEVELOPERS.</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#71717A]">
          <span className="uppercase">KEEP CODING. KEEP ROASTING.</span>
          <span className="w-5 h-[2px] bg-[#FF8A00] inline-block" />
        </div>
      </footer>
    </div>
  );
}