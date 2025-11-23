import type { GitHubUser, GitHubEvent, GitHubRepo } from './types';

// Cache revalidation time in seconds (5 minutes)
const REVALIDATE_TIME = 300; 

interface DataCollectionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fallbackUsed?: boolean;
}

async function fetchGitHubApi<T>(endpoint: string, token: string): Promise<DataCollectionResult<T>> {
  try {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
          revalidate: REVALIDATE_TIME
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: `Could not find a GitHub user at endpoint: ${endpoint}` };
      }
      if (response.status === 403) {
          const rateLimitReset = response.headers.get('x-ratelimit-reset');
          const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'later';
          return { success: false, error: `GitHub API rate limit exceeded. Please try again after ${resetTime}.` };
      }
      return { success: false, error: `Failed to fetch from GitHub API. Status: ${response.status}` };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    // Network error or other fetch-related issue
    return { success: false, error: error.message || "A network error occurred." };
  }
}

async function fetchAllPages<T>(endpoint: string, token: string): Promise<DataCollectionResult<T[]>> {
  let allResults: T[] = [];
  let page = 1;
  while (true) {
    const result = await fetchGitHubApi<T[]>(`${endpoint}?per_page=100&page=${page}`, token);
    if (!result.success || !result.data) {
        // If the first page fails, we return the error. For subsequent pages, we can be more lenient.
        if (page === 1) return { success: false, error: result.error };
        else break; // Stop pagination on error
    }
    if (result.data.length === 0) {
      break; // No more pages
    }
    allResults = allResults.concat(result.data);
    page++;
    if (page > 10) break; // Safety break to avoid infinite loops on very large accounts
  }
  return { success: true, data: allResults };
}


export async function fetchComprehensiveGitHubData(username: string) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    throw new Error('Server configuration error: GitHub token not found.');
  }

  // Priority 1: Fetch User Profile
  const userResult = await fetchGitHubApi<GitHubUser>(`/users/${username}`, GITHUB_TOKEN);
  if (!userResult.success || !userResult.data) {
    throw new Error(userResult.error || `Could not find a GitHub user named "${username}".`);
  }
  const user = userResult.data;

  // Priority 1: Fetch User Repositories
  const reposResult = await fetchAllPages<GitHubRepo>(`/users/${username}/repos`, GITHUB_TOKEN);
  const repos = reposResult.data || []; // Continue even if repos fail

  // Process repo data
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  // Priority 2: Fetch User Events
  const eventsResult = await fetchGitHubApi<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`, GITHUB_TOKEN);
  const events = eventsResult.data || []; // Continue even if events fail

  // Priority 3 data (like orgs) is skipped for now to keep the core flow fast and reliable.

  return {
    user,
    events,
    repos,
    totalStars,
    topLanguages,
  };
}
