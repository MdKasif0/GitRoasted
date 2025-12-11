import type { GitHubUser, GitHubEvent, GitHubRepo } from './types';

const REVALIDATE_TIME = 300; 

interface DataCollectionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fallbackUsed?: boolean;
  status?: number;
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
        return { success: false, error: `Could not find resource at endpoint: ${endpoint}`, status: 404 };
      }
      if (response.status === 403) {
          const rateLimitReset = response.headers.get('x-ratelimit-reset');
          const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'later';
          return { success: false, error: `GitHub API rate limit exceeded. Please try again after ${resetTime}.`, status: 403 };
      }
      return { success: false, error: `Failed to fetch from GitHub API. Status: ${response.status}`, status: response.status };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error fetching endpoint ${endpoint}:`, error);
    return { success: false, error: error.message || "A network error occurred." };
  }
}

async function fetchAllPages<T>(endpoint: string, token: string): Promise<DataCollectionResult<T[]>> {
  let allResults: T[] = [];
  let page = 1;
  while (true) {
    const result = await fetchGitHubApi<T[]>(`${endpoint}?per_page=100&page=${page}`, token);
    if (!result.success || !result.data) {
        if (page === 1) return { success: false, error: result.error, status: result.status };
        else break;
    }
    if (result.data.length === 0) {
      break; 
    }
    allResults = allResults.concat(result.data);
    page++;
    if (page > 10) break; 
  }
  return { success: true, data: allResults };
}


export async function fetchComprehensiveGitHubData(username: string) {
  if (!username || username === 'undefined') {
    throw { status: 400, message: 'Invalid username provided' };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    throw new Error('Server configuration error: GitHub token not found.');
  }

  const userResult = await fetchGitHubApi<GitHubUser>(`/users/${username}`, GITHUB_TOKEN);
  if (!userResult.success || !userResult.data) {
    if (userResult.status === 404) {
        throw { status: 404, username, message: `Could not find a GitHub user named \"${username}\".` };
    }
    throw new Error(userResult.error || `An unknown error occurred while fetching data for \"${username}\".`);
  }
  const user = userResult.data;

  const reposResult = await fetchAllPages<GitHubRepo>(`/users/${username}/repos`, GITHUB_TOKEN);
  const repos = reposResult.data || [];

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

  const eventsResult = await fetchGitHubApi<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`, GITHUB_TOKEN);
  const events = eventsResult.data || [];

  return {
    user,
    events,
    repos,
    totalStars,
    topLanguages,
  };
}
