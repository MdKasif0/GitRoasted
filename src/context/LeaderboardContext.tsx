
'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { LeaderboardEntry } from '@/lib/types';
import { startOfMonth, startOfWeek } from 'date-fns';

type TimeFilter = 'all' | 'month' | 'week';

const CACHE_KEY_PREFIX = 'gitroasted_leaderboard';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  lastUpdated: Date | null;
  refreshLeaderboard: (filter: TimeFilter, force?: boolean) => Promise<void>;
  addUser: (user: LeaderboardEntry) => void;
  filterLeaderboard: (filter: TimeFilter, searchTerm: string) => LeaderboardEntry[];
}

const LeaderboardContext = createContext<LeaderboardContextType | null>(null);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLeaderboardFromServer = useCallback(async (): Promise<LeaderboardEntry[]> => {
    try {
        const response = await fetch('/api/leaderboard', { cache: 'no-store' });
        if (!response.ok) {
            console.error("Failed to fetch leaderboard from API");
            return [];
        }
        const result = await response.json();
        
        // Firestore Timestamps will be serialized as strings, so we convert them back to Date objects
        return result.data.map((entry: any) => ({
            ...entry,
            roastedAt: new Date(entry.roastedAt),
        }));
    } catch (error) {
        console.error("Error fetching leaderboard from API:", error);
        return [];
    }
  }, []);

  const refreshLeaderboard = useCallback(async (filter: TimeFilter, force = false) => {
    setLoading(true);
    const cacheKey = `${CACHE_KEY_PREFIX}_all`; // Always use the 'all' cache

    if (force) {
        localStorage.removeItem(cacheKey);
    } else {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setLeaderboard(data.map((e: any) => ({...e, roastedAt: new Date(e.roastedAt) })));
                setLastUpdated(new Date(timestamp));
                setLoading(false);
                return;
            }
        }
    }

    const data = await getLeaderboardFromServer();
    const now = new Date();
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now.getTime() }));
    setLeaderboard(data);
    setLastUpdated(now);
    setLoading(false);
  }, [getLeaderboardFromServer]);

  const addUser = useCallback((newUser: LeaderboardEntry) => {
    setLeaderboard(prev => {
      const exists = prev.find(u => u.username === newUser.username);
      let updatedList: LeaderboardEntry[];

      if (exists) {
        updatedList = prev.map(u => 
          u.username === newUser.username ? { ...u, ...newUser, roastedAt: new Date() } : u
        );
      } else {
        updatedList = [...prev, { ...newUser, roastedAt: new Date() }];
      }
      
      updatedList.sort((a, b) => b.score - a.score);
      
      // Keep only top 100
      const top100 = updatedList.slice(0, 100);

      return top100;
    });
    setLastUpdated(new Date());
  }, []);

  const filterLeaderboard = useCallback((filter: TimeFilter, searchTerm: string): LeaderboardEntry[] => {
    const now = new Date();
    let dataToFilter = leaderboard;

    // Time-based filtering on the client side from the "all-time" cache
    if (filter === 'month') {
        const monthStart = startOfMonth(now);
        dataToFilter = dataToFilter.filter(entry => new Date(entry.roastedAt) >= monthStart);
    } else if (filter === 'week') {
        const weekStart = startOfWeek(now);
        dataToFilter = dataToFilter.filter(entry => new Date(entry.roastedAt) >= weekStart);
    }
    
    // Then, filter by search term
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
    <LeaderboardContext.Provider value={{ leaderboard, loading, lastUpdated, refreshLeaderboard, addUser, filterLeaderboard }}>
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
