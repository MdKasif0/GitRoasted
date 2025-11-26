
'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { LeaderboardEntry } from '@/lib/types';
import { startOfMonth, startOfWeek } from 'date-fns';

type TimeFilter = 'all' | 'month' | 'week';

interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  lastUpdated: Date | null;
  hasMore: boolean;
  totalUsers: number;
  refreshLeaderboard: (filter: TimeFilter, force?: boolean) => void;
  loadMore: (filter: TimeFilter) => void;
  addUser: (user: LeaderboardEntry) => void;
  filterLeaderboard: (filter: TimeFilter, searchTerm: string) => LeaderboardEntry[];
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastVisibleId, setLastVisibleId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchPage = useCallback(async (force = false, filter: TimeFilter) => {
    if (!force && !hasMore) {
        setLoading(false);
        return;
    };
    
    setLoading(true);

    const isRefreshing = force || lastVisibleId === null;
    const url = `/api/leaderboard?lastVisible=${isRefreshing ? '' : lastVisibleId}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const { data } = await response.json();
      const { leaderboard: newLeaderboard, totalUsers: newTotal, lastVisibleId: newLastVisibleId, hasMore: newHasMore } = data;

      const formattedLeaderboard = newLeaderboard.map((e: any) => ({ ...e, roastedAt: new Date(e.roastedAt) }));

      setLeaderboard(prev => isRefreshing ? formattedLeaderboard : [...prev, ...formattedLeaderboard]);
      setLastVisibleId(newLastVisibleId);
      setHasMore(newHasMore);
      setTotalUsers(newTotal);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, lastVisibleId]);


  const refreshLeaderboard = useCallback((filter: TimeFilter, force = false) => {
    setLeaderboard([]);
    setLastVisibleId(null);
    setHasMore(true);
    fetchPage(true, filter);
  }, [fetchPage]);
  
  const loadMore = useCallback((filter: TimeFilter) => {
      if(!loading && hasMore) {
          fetchPage(false, filter);
      }
  }, [loading, hasMore, fetchPage]);

  const addUser = useCallback((newUser: LeaderboardEntry) => {
    setLeaderboard(prev => {
      const exists = prev.find(u => u.username === newUser.username);
      let updatedList: LeaderboardEntry[];

      if (exists) {
        updatedList = prev.map(u => 
          u.username === newUser.username ? { ...u, ...newUser, roastedAt: new Date() } : u
        );
      } else {
        // Add to the top
        updatedList = [{ ...newUser, roastedAt: new Date() }, ...prev];
      }
      
      updatedList.sort((a, b) => b.score - a.score);
      
      return updatedList;
    });
    setTotalUsers(prev => prev + 1);
    setLastUpdated(new Date());
  }, []);

  const filterLeaderboard = useCallback((filter: TimeFilter, searchTerm: string): LeaderboardEntry[] => {
    const now = new Date();
    let dataToFilter = leaderboard;

    if (filter === 'month') {
        const monthStart = startOfMonth(now);
        dataToFilter = dataToFilter.filter(entry => new Date(entry.roastedAt) >= monthStart);
    } else if (filter === 'week') {
        const weekStart = startOfWeek(now);
        dataToFilter = dataToFilter.filter(entry => new Date(entry.roastedAt) >= weekStart);
    }
    
    if (!searchTerm) {
        return dataToFilter;
    }

    return dataToFilter.filter(entry => 
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [leaderboard]);


  useEffect(() => {
    refreshLeaderboard('all');
  }, [refreshLeaderboard]);

  return (
    <LeaderboardContext.Provider value={{ leaderboard, loading, lastUpdated, hasMore, totalUsers, refreshLeaderboard, loadMore, addUser, filterLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};
