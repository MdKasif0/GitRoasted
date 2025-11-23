import type { GitHubEvent } from './types';

const ROAST_KEYWORDS = ['fix', 'oops', 'revert', 'wip', 'todo', 'hack', 'temp', 'shit', 'fuck'];
const SELF_WORTH_KEYWORDS = ['finally', 'works', 'done', 'quick', 'dirty'];

export function calculateRoastScore(events: GitHubEvent[]): number {
  let score = 0;

  const pushEvents = events.filter(event => event.type === 'PushEvent' && 'commits' in event.payload && Array.isArray((event.payload as any).commits));
  
  if (pushEvents.length === 0) return 10; // Base score for no public commits

  for (const event of pushEvents) {
    // Score for time of day/week
    const commitDate = new Date(event.created_at);
    const dayOfWeek = commitDate.getDay();
    const hour = commitDate.getHours();

    // Committing on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      score += 15;
    }

    // Committing late at night or early morning
    if (hour < 6 || hour > 22) {
      score += 10;
    }

    const payload = event.payload as { commits: { message: string, sha: string }[] };
    for (const commit of payload.commits) {
      const message = commit.message.toLowerCase();

      // Score for commit message length
      if (message.length < 10) {
        score += 20; // Terse commit messages
      } else if (message.length > 100) {
        score += 10; // Verbose commit messages
      }

      // Score for keywords
      if (ROAST_KEYWORDS.some(keyword => message.includes(keyword))) {
        score += 25;
      }
      if (SELF_WORTH_KEYWORDS.some(keyword => message.includes(keyword))) {
        score += 15;
      }

      // Score for commit sha including 'dead' or 'bad'
      if (commit.sha.includes('dead') || commit.sha.includes('bad')) {
        score += 50; // Truly cursed
      }
    }
  }

  // Normalize score to be within a reasonable range, e.g., 0-1000
  const normalizedScore = Math.min(Math.round(score / pushEvents.length * 5), 1000);

  return Math.max(normalizedScore, 50); // Minimum score of 50
}
