
'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { LeaderboardEntry } from '@/lib/types';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
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
  const firestore = useFirestore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLeaderboardFromFirestore = useCallback(async (filter: TimeFilter): Promise<LeaderboardEntry[]> => {
    if (!firestore) return [];

    let baseQuery = query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(100));
    
    if (filter === 'month') {
        baseQuery = query(baseQuery, where('roastedAt', '>=', startOfMonth(new Date())));
    } else if (filter === 'week') {
        baseQuery = query(baseQuery, where('roastedAt', '>=', startOfWeek(new Date())));
    }

    const snapshot = await getDocs(baseQuery);
    return snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
            id: doc.id,
            ...docData,
            roastedAt: docData.roastedAt instanceof Timestamp ? docData.roastedAt.toDate() : new Date(docData.roastedAt),
        } as LeaderboardEntry;
    });
  }, [firestore]);

  const refreshLeaderboard = useCallback(async (filter: TimeFilter, force = false) => {
    setLoading(true);
    const cacheKey = `${CACHE_KEY_PREFIX}_${filter}`;

    if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setLeaderboard(data);
                setLastUpdated(new Date(timestamp));
                setLoading(false);
                return;
            }
        }
    }

    const data = await getLeaderboardFromFirestore(filter);
    const now = new Date();
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now.getTime() }));
    setLeaderboard(data);
    setLastUpdated(now);
    setLoading(false);
  }, [getLeaderboardFromFirestore]);

  const addUser = useCallback((newUser: LeaderboardEntry) => {
    setLeaderboard(prev => {
      const exists = prev.find(u => u.username === newUser.username);
      let updatedList: LeaderboardEntry[];

      if (exists) {
        updatedList = prev.map(u => 
          u.username === newUser.username ? { ...u, ...newUser } : u
        );
      } else {
        updatedList = [...prev, newUser];
      }
      
      updatedList.sort((a, b) => b.score - a.score);
      
      const top100 = updatedList.slice(0, 100);

      // Update all caches with the new data
      (['all', 'month', 'week'] as TimeFilter[]).forEach(filter => {
          const cacheKey = `${CACHE_KEY_PREFIX}_${filter}`;
          localStorage.setItem(cacheKey, JSON.stringify({
              data: top100,
              timestamp: Date.now()
          }));
      });

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
