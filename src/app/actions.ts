'use server';

import { generateGitHubRoast } from '@/ai/flows/generate-github-roast';
import { fetchComprehensiveGitHubData } from '@/lib/github';
import { calculateRoastScore } from '@/lib/scoring';
import type { RoastResultState } from '@/lib/types';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase
const { firestore: db } = initializeFirebase();

const usernameSchema = z.string().min(1, 'GitHub username cannot be empty.').max(39, 'GitHub username is too long.');

async function saveToLeaderboard(result: RoastResultState) {
    if (result.status !== 'success' || !result.user || !result.score) return;

    try {
        const leaderboardRef = doc(db, 'leaderboard', result.user.login);
        await setDoc(leaderboardRef, {
            userId: result.user.id.toString(),
            username: result.user.login,
            name: result.user.name || result.user.login,
            avatarUrl: result.user.avatar_url,
            score: result.score,
            roastedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error writing to leaderboard: ", error);
        // Silently fail on leaderboard writes for now
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

    const { user, events, totalStars, topLanguages } = comprehensiveData;

    const { score, breakdown } = calculateRoastScore(user, events, totalStars);

    const commitHistory = events
      .filter(e => e.type === 'PushEvent' && (e.payload as any).commits)
      .flatMap(e => (e.payload as any).commits)
      .map(commit => `- ${commit.message.split('\n')[0]}`)
      .slice(0, 20) // Limit commit history sent to AI
      .join('\n');
      
    if (commitHistory.length === 0 && user.public_repos === 0) {
      return {
        status: 'success',
        username,
        ...comprehensiveData,
        score,
        breakdown,
        roast: 'This user has no public activity to roast. Are they a ghost? A legend? Or just really good at keeping their chaotic code private? The world may never know.'
      };
    }

    const { roast } = await generateGitHubRoast({
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
    };

    // Save to leaderboard, but don't wait for it
    saveToLeaderboard(result);
    
    return result;
  } catch (error: any) {
    console.error('Error in getRoast action:', error);
    // User-facing errors are now more specific based on the fetch result
    if (error.message.includes('Could not find a GitHub user')) {
      return { status: 'error', message: `Could not find a GitHub user named "${username}". Check the spelling and try again.`, username };
    }
    if (error.message.includes('rate limit exceeded')) {
        return { status: 'error', message: `Looks like we're popular! GitHub API rate limit exceeded. Please try again in a few minutes.`, username };
    }
    // Fallback for other errors, like the token not being configured
    return { status: 'error', message: error.message || 'An unexpected error occurred. Please try again.', username };
  }
}
