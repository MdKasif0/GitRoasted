
import type { GitHubEvent, GitHubUser, GitHubRepo, ScoreBreakdown } from './types';
import { differenceInYears, differenceInDays } from 'date-fns';

// --- Scoring Weights ---
const WEIGHTS = {
  IMPACT: 250,
  CONSISTENCY: 200,
  QUALITY: 150,
  COMMUNITY: 150,
  DIVERSITY: 100,
  EXPERIENCE: 75,
  ACTIVITY: 50,
  SPECIAL_BONUS: 25,
};

// --- Helper Functions ---
const isUpdatedRecently = (date: string, months: number) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return diff < months * 30 * 24 * 60 * 60 * 1000;
};

// --- Scoring Logic ---

// 1. Impact Score (250 points max)
function calculateStarScore(totalStars: number): number {
  if (totalStars === 0) return 0;
  if (totalStars < 10) return totalStars * 2;
  if (totalStars < 100) return 20 + Math.log10(totalStars) * 15;
  if (totalStars < 1000) return 50 + Math.log10(totalStars) * 20;
  
  const baseScore = 80;
  const bonusScore = Math.min(20, Math.log10(totalStars / 1000) * 10);
  return baseScore + bonusScore; // Max 100 points
}

function calculateRepoQuality(repos: GitHubRepo[]): number {
    const qualityRepos = repos.filter(r => r.stargazers_count > 5 && !r.fork && !r.archived);
    if (qualityRepos.length === 0) return 0;
    
    let totalQuality = 0;
    const maxQualityRepos = Math.min(qualityRepos.length, 10);

    for (const repo of qualityRepos.slice(0, maxQualityRepos)) {
        let repoScore = 0;
        if (repo.description) repoScore += 2;
        if (repo.license) repoScore += 2;
        if (repo.topics?.length > 0) repoScore += 1;
        if (isUpdatedRecently(repo.pushed_at, 6)) repoScore += 3;
        // Mocked data for now as these are not in default GitHubRepo type
        // if (repo.has_readme) repoScore += 3;
        // if (repo.has_workflows) repoScore += 2;
        // if (repo.contributors_count > 1) repoScore += 5;
        totalQuality += repoScore;
    }
    // Max possible per repo is ~8 for now. Total for 10 is 80.
    return Math.min(80, (totalQuality / (8 * maxQualityRepos)) * 80);
}

function calculateStarDistribution(repos: GitHubRepo[]): number {
    const starCounts = repos.map(r => r.stargazers_count).sort((a, b) => b - a);
    if (starCounts.length === 0 || starCounts[0] === 0) return 0;

    const topRepo = starCounts[0];
    const topThree = starCounts.slice(0, 3).reduce((a, b) => a + b, 0);
    const total = starCounts.reduce((a, b) => a + b, 0);

    const topProjectScore = Math.min(20, (topRepo / 1000) * 20);
    const concentrationScore = total > 0 ? (topThree / total) * 20 : 0;

    return topProjectScore + concentrationScore; // Max 40 points
}

function calculateForkImpact(repos: GitHubRepo[]): number {
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    if (totalForks === 0) return 0;
    if (totalForks < 10) return totalForks * 1;
    if (totalForks < 100) return 10 + Math.log10(totalForks) * 5;
    
    const baseScore = 20;
    const bonusScore = Math.min(10, Math.log10(totalForks / 100) * 5);
    return baseScore + bonusScore; // Max 30 points
}


function getImpactScore(repos: GitHubRepo[]): number {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const starScore = calculateStarScore(totalStars);
  const qualityScore = calculateRepoQuality(repos);
  const distributionScore = calculateStarDistribution(repos);
  const forkScore = calculateForkImpact(repos);

  const totalImpact = starScore + qualityScore + distributionScore + forkScore;
  return (totalImpact / (100 + 80 + 40 + 30)) * WEIGHTS.IMPACT;
}


// 2. Consistency Score (200 points max)
function getConsistencyScore(events: GitHubEvent[]): number {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const pushEvents = events.filter(e => e.type === 'PushEvent' && new Date(e.created_at) > oneYearAgo);
  const activeDays = new Set(pushEvents.map(e => e.created_at.split('T')[0])).size;
  
  const frequencyScore = Math.min(100, (activeDays / 365) * 100);
  
  const totalCommits = pushEvents.reduce((acc, e) => acc + ((e.payload as any).commits?.length || 0), 0);
  const volumeScore = Math.min(50, Math.log10(totalCommits + 1) / Math.log10(2001) * 50);

  // Historical consistency is simplified for this implementation
  const historicalScore = 25;

  const totalConsistency = frequencyScore + volumeScore + historicalScore;
  return (totalConsistency / (100 + 50 + 50)) * WEIGHTS.CONSISTENCY;
}

// 3. Quality Score (150 points max)
function getQualityScore(events: GitHubEvent[], repos: GitHubRepo[]): number {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const prEvents = events.filter(e => e.type === 'PullRequestEvent' && new Date(e.created_at) > oneYearAgo);
  const createdPRs = prEvents.filter(e => (e.payload as any).action === 'opened').length;
  const reviewScore = Math.min(40, createdPRs * 2);

  const issueEvents = events.filter(e => e.type === 'IssuesEvent' && new Date(e.created_at) > oneYearAgo);
  const createdIssues = issueEvents.filter(e => (e.payload as any).action === 'opened').length;
  const issueScore = Math.min(30, createdIssues * 1.5);
  
  const recentlyMaintained = repos.filter(r => isUpdatedRecently(r.pushed_at, 3)).length;
  const maintenanceScore = Math.min(60, recentlyMaintained * 6);
  
  const qualityToolsScore = 20; // Mocked

  const totalQuality = reviewScore + issueScore + maintenanceScore + qualityToolsScore;
  return (totalQuality / (40 + 30 + 60 + 20)) * WEIGHTS.QUALITY;
}

// 4. Community Score (150 points max)
function getCommunityScore(user: GitHubUser, repos: GitHubRepo[]): number {
  const followerScore = Math.min(50, (Math.log10(user.followers + 1) / 4) * 25 + (user.followers / (user.following + 1) / 2) * 25);
  
  const orgs = new Set(repos.filter(r => r.owner.type === 'Organization').map(r => r.owner.login));
  const orgScore = Math.min(40, orgs.size * 8);

  const collaborationScore = Math.min(40, repos.filter(r => !r.fork).length * 4);
  
  let engagementScore = 0;
  if(user.blog) engagementScore += 5;
  if(user.twitter_username) engagementScore += 5;
  if(user.bio) engagementScore += 5;
  if(user.company) engagementScore += 5;

  const totalCommunity = followerScore + orgScore + collaborationScore + engagementScore;
  return (totalCommunity / (50 + 40 + 40 + 20)) * WEIGHTS.COMMUNITY;
}

// 5. Diversity Score (100 points max)
function getDiversityScore(repos: GitHubRepo[]): number {
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const varietyScore = Math.min(50, languages.size * 5);
  // Other scores are simplified
  return (varietyScore / 50) * WEIGHTS.DIVERSITY;
}

// 6. Experience Score (75 points max)
function getExperienceScore(user: GitHubUser): number {
    const ageInYears = differenceInYears(new Date(), new Date(user.created_at));
    const ageScore = Math.min(40, ageInYears * 4);
    
    let completeness = 0;
    if (user.name) completeness += 3;
    if (user.bio) completeness += 3;
    if (user.location) completeness += 2;
    if (user.company) completeness += 2;
    if (user.blog) completeness += 2;
    if (user.twitter_username) completeness += 2;
    const completenessScore = Math.min(15, completeness);
    
    // Early adopter bonus simplified
    const joinYear = new Date(user.created_at).getFullYear();
    const earlyAdopterScore = joinYear < 2012 ? 20 : joinYear < 2015 ? 10 : 0;

    const totalExperience = ageScore + completenessScore + earlyAdopterScore;
    return (totalExperience / (40 + 15 + 20)) * WEIGHTS.EXPERIENCE;
}

// 7. Activity Score (50 points max)
function getActivityScore(events: GitHubEvent[]): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEvents = events.filter(e => new Date(e.created_at) > thirtyDaysAgo).length;
    return Math.min(50, recentEvents * 2.5);
}

// 8. Special Bonus (25 points max)
function getSpecialBonus(repos: GitHubRepo[]): number {
    let bonus = 0;
    if (repos.some(r => r.stargazers_count >= 1000)) {
        bonus += 10;
    }
    // Other bonuses simplified
    return bonus;
}

/**
 * Calculates the roast score based on various GitHub stats.
 * @returns An object containing the final score and a breakdown.
 */
export function calculateRoastScore(
  user: GitHubUser,
  events: GitHubEvent[],
  repos: GitHubRepo[],
): { score: number; breakdown: ScoreBreakdown } {
  
  const breakdown: ScoreBreakdown = {
    impact: getImpactScore(repos),
    consistency: getConsistencyScore(events),
    quality: getQualityScore(events, repos),
    community: getCommunityScore(user, repos),
    diversity: getDiversityScore(repos),
    experience: getExperienceScore(user),
    activity: getActivityScore(events),
    specialBonus: getSpecialBonus(repos),
  };

  const totalScore = Object.values(breakdown).reduce((sum, points) => sum + points, 0);

  // The final score is inverted for the roast!
  // A high component score means a better profile, but we want a higher "roast score" for more roastable profiles.
  const seriousnessScore = Math.min(1000, totalScore);

  return {
    score: Math.round(1000 - seriousnessScore),
    breakdown: {
      impact: Math.round(breakdown.impact),
      consistency: Math.round(breakdown.consistency),
      quality: Math.round(breakdown.quality),
      community: Math.round(breakdown.community),
      diversity: Math.round(breakdown.diversity),
      experience: Math.round(breakdown.experience),
      activity: Math.round(breakdown.activity),
      specialBonus: Math.round(breakdown.specialBonus),
    },
  };
}
