'use server';

import { generateGitHubRoast } from '@/ai/flows/generate-github-roast';
import { fetchComprehensiveGitHubData } from '@/lib/github';
import { calculateRoastScore } from '@/lib/scoring';
import type { RoastResultState } from '@/lib/types';
import { z } from 'zod';

const usernameSchema = z.string().min(1, 'GitHub username cannot be empty.').max(39, 'GitHub username is too long.');

export async function getRoast(prevState: RoastResultState, formData: FormData): Promise<RoastResultState> {
  const username = formData.get('username') as string;

  const validation = usernameSchema.safeParse(username);

  if (!validation.success) {
    return { status: 'error', message: validation.error.errors[0].message };
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
        ...comprehensiveData,
        score,
        breakdown,
        roast: 'This user has no public activity to roast. Are they a ghost? A legend? Or just really good at keeping their chaotic code private? The world may never know.'
      };
    }
    
    // Set a loading status before calling the AI
    // This allows the UI to show a loading state for the roast text itself
    Promise.resolve().then(() => {
        // A little trick to update the UI without a full re-render
    });

    const { roast } = await generateGitHubRoast({
      user,
      score,
      breakdown,
      commitHistory,
      totalStars,
      topLanguages,
    });
    
    return {
      status: 'success',
      ...comprehensiveData,
      score,
      breakdown,
      roast,
    };
  } catch (error: any) {
    console.error('Error in getRoast action:', error);
    return { status: 'error', message: error.message || 'An unexpected error occurred. Please try again.' };
  }
}
