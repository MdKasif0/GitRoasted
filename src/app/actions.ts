
'use server';

import { generateGitHubRoast } from '@/ai/flows/generate-github-roast';
import { fetchComprehensiveGitHubData } from '@/lib/github';
import { calculateRoastScore } from '@/lib/scoring';
import type { RoastResultState, LeaderboardEntry } from '@/lib/types';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { revalidateTag } from 'next/cache';

// Initialize Firebase
const { firestore: db } = initializeFirebase();

const usernameSchema = z.string().min(1, 'GitHub username cannot be empty.').max(39, 'GitHub username is too long.');

async function saveToLeaderboard(result: RoastResultState): Promise<LeaderboardEntry | null> {
    if (result.status !== 'success' || !result.user || !result.score || !result.leaderboardRoast) return null;

    try {
        const leaderboardRef = doc(db, 'leaderboard', result.user.login);
        const seriousnessScore = 1000 - result.score;
        
        const entry: Omit<LeaderboardEntry, 'roastedAt'> = {
            userId: result.user.id.toString(),
            username: result.user.login,
            name: result.user.name || result.user.login,
            avatarUrl: result.user.avatar_url,
            score: seriousnessScore,
            roast: result.leaderboardRoast,
        };
        
        await setDoc(leaderboardRef, {
            ...entry,
            roastedAt: serverTimestamp()
        }, { merge: true });

        revalidateTag('leaderboard');
        
        // Give the server a moment to revalidate the tag before the client might refetch
        await new Promise(resolve => setTimeout(resolve, 1000));


        // Return the entry for optimistic updates, adding a client-side timestamp
        return { ...entry, roastedAt: new Date().toISOString() } as LeaderboardEntry;
    } catch (error) {
        console.error("Error writing to leaderboard: ", error);
        // Silently fail on leaderboard writes for now, but don't return an entry
        return null;
    }
}

export async function getComparisonData(user1: string, user2: string): Promise<{ data1: RoastResultState | null; data2: RoastResultState | null; error?: string; }> {
  try {
    const [result1, result2] = await Promise.all([
      fetchComprehensiveGitHubData(user1).then(async (data) => ({
        ...data,
        roastResult: await calculateRoastScore(data.user, data.events, data.repos)
      })),
      fetchComprehensiveGitHubData(user2).then(async (data) => ({
        ...data,
        roastResult: await calculateRoastScore(data.user, data.events, data.repos)
      }))
    ]);
    
    const data1: RoastResultState = { status: 'success', username: user1, ...result1, score: 1000 - result1.roastResult.score, breakdown: result1.roastResult.breakdown, archetype: result1.roastResult.archetype };
    const data2: RoastResultState = { status: 'success', username: user2, ...result2, score: 1000 - result2.roastResult.score, breakdown: result2.roastResult.breakdown, archetype: result2.roastResult.archetype };

    return { data1, data2 };

  } catch (err: any) {
    console.error('Comparison error in server action:', err);
    return { data1: null, data2: null, error: err.message || 'Failed to fetch data for one or both users.' };
  }
}


export async function getRoast(prevState: RoastResultState, formData: FormData): Promise<RoastResultState> {
  const username = formData.get('username') as string;

  const validation = usernameSchema.safeParse(username);

  if (!validation.success) {
    return { status: 'error', message: validation.error.errors[0].message, username };
  }

  try {
    const comprehensiveData = await fetchComprehensiveGitHubData(username);

    const { user, events, repos, totalStars, topLanguages } = comprehensiveData;

    const { score, breakdown, archetype } = await calculateRoastScore(user, events, repos);

    const commitHistory = events
      .filter(e => e.type === 'PushEvent' && (e.payload as any).commits)
      .flatMap(e => (e.payload as any).commits)
      .map(commit => `- ${commit.message.split('\n')[0]}`)
      .slice(0, 20) // Limit commit history sent to AI
      .join('\n');
      
    if (commitHistory.length === 0 && user.public_repos === 0) {
      const result: RoastResultState = {
        status: 'success',
        username,
        ...comprehensiveData,
        score,
        breakdown,
        archetype,
        roast: 'This user has no public activity to roast. Are they a ghost? A legend? Or just really good at keeping their chaotic code private? The world may never know.',
        leaderboardRoast: 'So private, they make ghosts look sociable.',
      };
      
      const newLeaderboardEntry = await saveToLeaderboard(result);
      return { ...result, newLeaderboardEntry };
    }

    const { roast, leaderboardRoast } = await generateGitHubRoast({
      user,
      score,
      breakdown,
      commitHistory,
      totalStars,
      topLanguages,
    });
    
    const result: RoastResultState = {
      status: 'success',
      username,
      ...comprehensiveData,
      score,
      breakdown,
      roast,
      leaderboardRoast,
      archetype
    };
    
    const newLeaderboardEntry = await saveToLeaderboard(result);
    
    return { ...result, newLeaderboardEntry };
  } catch (error: any) {
    console.error('Error in getRoast action:', error);
    if (error.message.includes('Could not find a GitHub user')) {
      return { status: 'error', message: `Could not find a GitHub user named "${username}". Check the spelling and try again.`, username };
    }
    if (error.message.includes('rate limit exceeded')) {
        return { status: 'error', message: `Looks like we're popular! ${error.message}`, username };
    }
    return { status: 'error', message: error.message || 'An unexpected error occurred. Please try again.', username };
  }
}
