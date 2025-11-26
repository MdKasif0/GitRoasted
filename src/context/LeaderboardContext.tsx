
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
  refreshLeaderboard: () => void;
  loadMore: () => void;
  addUser: (user: LeaderboardEntry) => void;
  filterLeaderboard: (filter: TimeFilter, searchTerm: string) => LeaderboardEntry[];
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

const CACHE_KEY = 'leaderboard_pages';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const saveToCache = (page: number, data: any) => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cached[page] = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.warn("Could not save to localStorage", error);
  }
};

const getFromCache = (page: number): any | null => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const pageData = cached[page];
    
    if (pageData && Date.now() - pageData.timestamp < CACHE_DURATION) {
      return pageData.data;
    }
    return null;
  } catch (error) {
    console.warn("Could not read from localStorage", error);
    return null;
  }
};


export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastVisibleId, setLastVisibleId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    const fetchPage = async () => {
      if (currentPage === 1) {
          setLoading(true);
      }

      const isFirstPage = currentPage === 1;

      if (!isFirstPage && !hasMore) {
        setLoading(false);
        return;
      }

      const cachedData = getFromCache(currentPage);
      if (cachedData && !isRefreshing) {
        setLeaderboard(prev => {
          const existingUsernames = new Set(prev.map(u => u.username));
          const uniqueNewUsers = cachedData.leaderboard.filter((u: LeaderboardEntry) => !existingUsernames.has(u.username));
          return isRefreshing ? cachedData.leaderboard : [...prev, ...uniqueNewUsers];
        });
        setLastVisibleId(cachedData.lastVisibleId);
        setHasMore(cachedData.hasMore);
        setTotalUsers(cachedData.totalUsers);
        if (isFirstPage) setLoading(false);
        if (isRefreshing) setLastUpdated(new Date());
        return;
      }
      
      const lastId = isRefreshing || isFirstPage ? '' : lastVisibleId || '';
      const url = `/api/leaderboard?lastVisible=${lastId}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const { data } = await response.json();
        const { leaderboard: newLeaderboard, totalUsers: newTotal, lastVisibleId: newLastVisibleId, hasMore: newHasMore } = data;

        const formattedLeaderboard = newLeaderboard.map((e: any) => ({ ...e, roastedAt: new Date(e.roastedAt) }));
        
        const resultToCache = {
          leaderboard: formattedLeaderboard,
          lastVisibleId: newLastVisibleId,
          hasMore: newHasMore,
          totalUsers: newTotal,
        };
        saveToCache(currentPage, resultToCache);

        setLeaderboard(prev => {
           const existingUsernames = new Set(prev.map(u => u.username));
           const uniqueNewUsers = formattedLeaderboard.filter((u: LeaderboardEntry) => !existingUsernames.has(u.username));
           return (isRefreshing || isFirstPage) ? formattedLeaderboard : [...prev, ...uniqueNewUsers]
        });

        setLastVisibleId(newLastVisibleId);
        setHasMore(newHasMore);
        setTotalUsers(newTotal);

        if (isRefreshing) {
          setLastUpdated(new Date());
          setIsRefreshing(false);
        }

      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        if (isFirstPage) setLoading(false);
      }
    };
    
    fetchPage();
  }, [currentPage, isRefreshing]);

  const refreshLeaderboard = useCallback(() => {
    setLeaderboard([]);
    setLastVisibleId(null);
    setHasMore(true);
    setCurrentPage(1);
    setIsRefreshing(true);
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn("Could not clear localStorage", error);
    }
  }, []);
  
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  const addUser = useCallback((newUser: LeaderboardEntry) => {
    setLeaderboard(prev => {
      const exists = prev.find(u => u.username === newUser.username);
      let updatedList: LeaderboardEntry[];

      if (exists) {
        updatedList = prev.map(u => 
          u.username === newUser.username ? { ...newUser, roastedAt: new Date() } : u
        );
      } else {
        updatedList = [{ ...newUser, roastedAt: new Date() }, ...prev];
      }
      
      updatedList.sort((a, b) => b.score - a.score);
      
      return updatedList;
    });
    if (!leaderboard.some(u => u.username === newUser.username)) {
      setTotalUsers(prev => prev + 1);
    }
    setLastUpdated(new Date());
  }, [leaderboard]);

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
