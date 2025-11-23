import type { GitHubEvent, GitHubUser, ScoreBreakdown } from './types';
import { differenceInYears, differenceInDays } from 'date-fns';

// --- Scoring Weights ---
const WEIGHTS = {
  STARS: 25,
  FOLLOWER_RATIO: 15,
  FOLLOWER_COUNT: 10,
  CONTRIBUTION_FREQUENCY: 25,
  ACCOUNT_AGE: 10,
  TOTAL_CONTRIBUTIONS: 15,
};

// --- Scoring Thresholds ---
const MAX_STARS_FOR_POINTS = 1000;
const IDEAL_FOLLOWER_RATIO = 2;
const MAX_FOLLOWERS_FOR_POINTS = 500;
const MAX_CONTRIBUTION_DAYS = 365; // Days in a year
const MAX_ACCOUNT_AGE_YEARS = 5;
const MAX_TOTAL_CONTRIBUTIONS = 2000;


/**
 * Calculates the roast score based on various GitHub stats.
 * @returns An object containing the final score and a breakdown.
 */
export function calculateRoastScore(
  user: GitHubUser,
  events: GitHubEvent[],
  totalStars: number
): { score: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = {
    stars: 0,
    followerRatio: 0,
    followerCount: 0,
    contributionFrequency: 0,
    accountAge: 0,
    totalContributions: 0,
  };

  // 1. Stars received (logarithmic)
  const starScore = Math.log10(totalStars + 1) / Math.log10(MAX_STARS_FOR_POINTS + 1);
  breakdown.stars = Math.min(Math.round(starScore * WEIGHTS.STARS), WEIGHTS.STARS);

  // 2. Followers/Following ratio
  const ratio = user.following > 0 ? user.followers / user.following : user.followers > 0 ? IDEAL_FOLLOWER_RATIO : 0;
  const ratioScore = Math.min(ratio / IDEAL_FOLLOWER_RATIO, 1);
  breakdown.followerRatio = Math.round(ratioScore * WEIGHTS.FOLLOWER_RATIO);

  // 3. Raw follower count
  const followerCountScore = Math.min(user.followers / MAX_FOLLOWERS_FOR_POINTS, 1);
  breakdown.followerCount = Math.round(followerCountScore * WEIGHTS.FOLLOWER_COUNT);

  // 4. Contribution frequency (unique days with push events in the last year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const recentPushEvents = events.filter(e => e.type === 'PushEvent' && new Date(e.created_at) > oneYearAgo);
  const activeDays = new Set(recentPushEvents.map(e => e.created_at.split('T')[0])).size;
  const contributionFrequencyScore = Math.min(activeDays / MAX_CONTRIBUTION_DAYS, 1);
  breakdown.contributionFrequency = Math.round(contributionFrequencyScore * WEIGHTS.CONTRIBUTION_FREQUENCY);

  // 5. Account age
  const accountAgeYears = differenceInYears(new Date(), new Date(user.created_at));
  const accountAgeScore = Math.min(accountAgeYears / MAX_ACCOUNT_AGE_YEARS, 1);
  breakdown.accountAge = Math.round(accountAgeScore * WEIGHTS.ACCOUNT_AGE);

  // 6. Total contributions (based on push events)
  const totalPushCommits = events
    .filter(e => e.type === 'PushEvent' && (e.payload as any).commits)
    .reduce((sum, e) => sum + (e.payload as any).commits.length, 0);
  const totalContributionsScore = Math.min(totalPushCommits / MAX_TOTAL_CONTRIBUTIONS, 1);
  breakdown.totalContributions = Math.round(totalContributionsScore * WEIGHTS.TOTAL_CONTRIBUTIONS);
  
  // Calculate final score
  const totalScore = Math.round(Object.values(breakdown).reduce((sum, points) => sum + points, 0));

  // The final score is inverted for the roast! Higher component scores mean a BETTER profile,
  // but we want a HIGHER roast score for "worse" profiles.
  // So we'll create a "seriousness" score and then invert it.
  const seriousnessScore = (totalScore / 100) * 999 + 1;

  return {
    score: Math.round(1000 - seriousnessScore),
    breakdown,
  };
}
