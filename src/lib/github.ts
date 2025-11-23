import type { GitHubUser, GitHubEvent, GitHubRepo } from './types';

async function fetchGitHubApi<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub resource not found at endpoint: ${endpoint}`);
    }
    if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'unknown';
        throw new Error(`GitHub API rate limit exceeded. Please try again after ${resetTime}.`);
    }
    throw new Error(`Failed to fetch from GitHub API. Status: ${response.status}`);
  }
  return response.json();
}

async function fetchAllPages<T>(endpoint: string, token: string): Promise<T[]> {
  let allResults: T[] = [];
  let page = 1;
  while (true) {
    const results = await fetchGitHubApi<T[]>(`${endpoint}?per_page=100&page=${page}`, token);
    if (results.length === 0) {
      break;
    }
    allResults = allResults.concat(results);
    page++;
  }
  return allResults;
}


export async function fetchComprehensiveGitHubData(username: string) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    throw new Error('Server configuration error: GitHub token not found.');
  }

  const [user, events, repos] = await Promise.all([
    fetchGitHubApi<GitHubUser>(`/users/${username}`, GITHUB_TOKEN),
    fetchGitHubApi<GitHubEvent[]>(`/users/${username}/events?per_page=100`, GITHUB_TOKEN),
    fetchAllPages<GitHubRepo>(`/users/${username}/repos`, GITHUB_TOKEN),
  ]);

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

  return {
    user,
    events,
    repos,
    totalStars,
    topLanguages,
  };
}
