'use server';

import { generateGitHubRoast } from '@/ai/flows/generate-github-roast';
import { calculateRoastScore } from '@/lib/scoring';
import type { GitHubUser, GitHubEvent, RoastResultState } from '@/lib/types';
import { z } from 'zod';

const usernameSchema = z.string().min(1, 'GitHub username cannot be empty.').max(39, 'GitHub username is too long.');

export async function getRoast(prevState: RoastResultState, formData: FormData): Promise<RoastResultState> {
  const username = formData.get('username') as string;

  const validation = usernameSchema.safeParse(username);

  if (!validation.success) {
    return { status: 'error', message: validation.error.errors[0].message };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    console.error('GitHub token not configured.');
    return { status: 'error', message: 'Server configuration error. Please try again later.' };
  }

  try {
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // Fetch user data and events in parallel
    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return { status: 'error', message: `GitHub user "${username}" not found.` };
      }
      return { status: 'error', message: `Failed to fetch GitHub user. Status: ${userRes.status}` };
    }

    const user: GitHubUser = await userRes.json();
    const events: GitHubEvent[] = eventsRes.ok ? await eventsRes.json() : [];

    const score = calculateRoastScore(events);

    const commitHistory = events
      .filter(e => e.type === 'PushEvent' && (e.payload as any).commits)
      .flatMap(e => (e.payload as any).commits)
      .map(commit => `- ${commit.message.split('\n')[0]}`)
      .slice(0, 20) // Limit commit history sent to AI
      .join('\n');

    if (commitHistory.length === 0) {
      return {
        status: 'success',
        user,
        score,
        roast: 'This user has no public commits to roast. Are they even a real developer? Or just a very, very good one who never makes mistakes in public? The mystery remains.'
      };
    }

    const { roast } = await generateGitHubRoast({
      username: user.login,
      commitHistory,
    });
    
    return {
      status: 'success',
      user,
      score,
      roast,
    };
  } catch (error) {
    console.error('Error in getRoast action:', error);
    return { status: 'error', message: 'An unexpected error occurred. Please try again.' };
  }
}
