

import type { GitHubEvent, GitHubUser, GitHubRepo, ScoreBreakdown, DeveloperArchetype } from './types';
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


function getImpactScore(repos: GitHubRepo[]): { total: number; breakdown: { [key: string]: number } } {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const starScore = calculateStarScore(totalStars);
  const qualityScore = calculateRepoQuality(repos);
  const distributionScore = calculateStarDistribution(repos);
  const forkScore = calculateForkImpact(repos);

  const totalImpact = starScore + qualityScore + distributionScore + forkScore;
  const scaledTotal = (totalImpact / (100 + 80 + 40 + 30)) * WEIGHTS.IMPACT;
  
  return {
    total: scaledTotal,
    breakdown: {
      'Total Stars': starScore,
      'Repo Quality': qualityScore,
      'Star Distribution': distributionScore,
      'Fork Impact': forkScore,
    }
  }
}


// 2. Consistency Score (200 points max)
function getConsistencyScore(events: GitHubEvent[]): { total: number; breakdown: { [key: string]: number } } {
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
  const scaledTotal = (totalConsistency / (100 + 50 + 50)) * WEIGHTS.CONSISTENCY;

  return {
      total: scaledTotal,
      breakdown: {
          'Frequency': frequencyScore,
          'Volume': volumeScore,
          'Historical': historicalScore
      }
  }
}

// 3. Quality Score (150 points max)
function getQualityScore(events: GitHubEvent[], repos: GitHubRepo[]): { total: number; breakdown: { [key: string]: number } } {
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
  const scaledTotal = (totalQuality / (40 + 30 + 60 + 20)) * WEIGHTS.QUALITY;

  return {
      total: scaledTotal,
      breakdown: {
          'Code Review': reviewScore,
          'Issue Engagement': issueScore,
          'Maintenance': maintenanceScore,
          'Tooling': qualityToolsScore
      }
  }
}

// 4. Community Score (150 points max)
function getCommunityScore(user: GitHubUser, repos: GitHubRepo[]): { total: number; breakdown: { [key: string]: number } } {
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
  const scaledTotal = (totalCommunity / (50 + 40 + 40 + 20)) * WEIGHTS.COMMUNITY;

  return {
      total: scaledTotal,
      breakdown: {
          'Followers': followerScore,
          'Organizations': orgScore,
          'Collaboration': collaborationScore,
          'Engagement': engagementScore
      }
  }
}

// 5. Diversity Score (100 points max)
function getDiversityScore(repos: GitHubRepo[]): { total: number; breakdown: { [key: string]: number } } {
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const varietyScore = Math.min(50, languages.size * 5);
  // Other scores are simplified
  const scaledTotal = (varietyScore / 50) * WEIGHTS.DIVERSITY;

  return {
      total: scaledTotal,
      breakdown: {
          'Language Variety': varietyScore
      }
  }
}

// 6. Experience Score (75 points max) - With fairness adjustment
function getExperienceScore(user: GitHubUser): { total: number; breakdown: { [key: string]: number } } {
    const ageInYears = differenceInYears(new Date(), new Date(user.created_at));
    
    // Fairness Adjustment: Scale score for accounts younger than 1 year.
    const fairnessFactor = Math.min(1, ageInYears / 1.0);

    const ageScore = Math.min(40, ageInYears * 4);
    
    let completeness = 0;
    if (user.name) completeness += 3;
    if (user.bio) completeness += 3;
    if (user.location) completeness += 2;
    if (user.company) completeness += 2;
    if (user.blog) completeness += 2;
    if (user.twitter_username) completeness += 2;
    const completenessScore = Math.min(15, completeness);
    
    const joinYear = new Date(user.created_at).getFullYear();
    const earlyAdopterScore = joinYear < 2012 ? 20 : joinYear < 2015 ? 10 : 0;

    const totalExperience = ageScore + completenessScore + earlyAdopterScore;
    
    // Apply fairness adjustment
    const adjustedTotal = (totalExperience / (40 + 15 + 20)) * WEIGHTS.EXPERIENCE;
    const scaledTotal = adjustedTotal * fairnessFactor;

    return {
        total: scaledTotal,
        breakdown: {
            'Account Age': ageScore,
            'Profile Completeness': completenessScore,
            'Early Adopter': earlyAdopterScore,
        }
    }
}

// 7. Activity Score (50 points max)
function getActivityScore(events: GitHubEvent[]): { total: number; breakdown: { [key: string]: number } } {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEvents = events.filter(e => new Date(e.created_at) > thirtyDaysAgo).length;
    const scaledTotal = Math.min(50, recentEvents * 2.5);

    return {
        total: scaledTotal,
        breakdown: {
            'Recent Events': scaledTotal
        }
    }
}

// 8. Special Bonus (25 points max)
function getSpecialBonus(repos: GitHubRepo[]): { total: number; breakdown: { [key: string]: number } } {
    let bonus = 0;
    if (repos.some(r => r.stargazers_count >= 1000)) {
        bonus += 10;
    }
    // Other bonuses simplified
    return {
        total: bonus,
        breakdown: {
            'Viral Repo': bonus
        }
    };
}


function determineDeveloperArchetype(
    breakdown: ScoreBreakdown,
    user: GitHubUser,
    repos: GitHubRepo[],
    events: GitHubEvent[],
    totalStars: number
): DeveloperArchetype {
    const hasHighImpact = breakdown.impact.total > 180;
    const hasHighConsistency = breakdown.consistency.total > 140;
    const hasHighCommunity = breakdown.community.total > 110;
    const hasHighDiversity = breakdown.diversity.total > 70;
    
    const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const pushEventsLast90Days = events.filter(e => e.type === 'PushEvent' && new Date(e.created_at) > ninetyDaysAgo).length;
    const isActiveContributor = pushEventsLast90Days > 50; // Simplified from your example

    const orgs = new Set(repos.filter(r => r.owner.type === 'Organization').map(r => r.owner.login));
    const hasOrgInvolvement = orgs.size > 2;

    if (hasHighImpact && avgStars > 50 && repos.length < 30) {
        return {
            type: 'Project Maintainer',
            description: 'You focus on building and maintaining quality projects with significant impact.',
            characteristics: [
                'Fewer repositories but highly polished',
                'Strong community engagement around projects',
                'Consistent maintenance and updates',
            ]
        };
    }

    if (hasHighDiversity && repos.length > 50) {
        return {
            type: 'Technology Explorer',
            description: 'You love experimenting with different technologies and building diverse projects.',
            characteristics: [
                'Wide variety of programming languages',
                'Many experimental or personal projects',
                'Quick to adopt new technologies',
            ]
        };
    }
    
    if (hasHighCommunity && hasOrgInvolvement) {
        return {
            type: 'Open Source Contributor',
            description: 'You actively contribute to various projects and collaborate with the community.',
            characteristics: [
                'Regular contributions to external projects',
                'Active in multiple organizations',
                'Strong social engagement within GitHub',
            ]
        };
    }
    
    if (hasHighConsistency && isActiveContributor) {
        return {
            type: 'Consistent Builder',
            description: 'You maintain a steady development pace with regular, meaningful contributions.',
            characteristics: [
                'Demonstrates a strong daily contribution habit',
                'Likely has long contribution streaks',
                'Reliable and dedicated developer',
            ]
        };
    }

    return {
        type: 'Rising Developer',
        description: "You're building your presence on GitHub with growing skills and activity.",
        characteristics: [
            'Actively learning and growing',
            'Building a portfolio of projects steadily',
            'Shows great potential for future impact',
        ]
    };
}


/**
 * Calculates the roast score based on various GitHub stats.
 * @returns An object containing the final score and a breakdown.
 */
export function calculateRoastScore(
  user: GitHubUser,
  events: GitHubEvent[],
  repos: GitHubRepo[],
): { score: number; breakdown: ScoreBreakdown, archetype: DeveloperArchetype; } {
  
  const impact = getImpactScore(repos);
  const consistency = getConsistencyScore(events);
  const quality = getQualityScore(events, repos);
  const community = getCommunityScore(user, repos);
  const diversity = getDiversityScore(repos);
  const experience = getExperienceScore(user);
  const activity = getActivityScore(events);
  const specialBonus = getSpecialBonus(repos);

  const breakdown: ScoreBreakdown = {
    impact,
    consistency,
    quality,
    community,
    diversity,
    experience,
    activity,
    specialBonus,
  };

  const totalScore = Object.values(breakdown).reduce((sum, category) => sum + category.total, 0);

  // The final score is inverted for the roast!
  // A high component score means a better profile, but we want a higher "roast score" for more roastable profiles.
  const seriousnessScore = Math.min(1000, totalScore);

  const roundedBreakdown = Object.entries(breakdown).reduce((acc, [key, value]) => {
      acc[key as keyof ScoreBreakdown] = {
          total: Math.round(value.total),
          breakdown: Object.entries(value.breakdown).reduce((subAcc, [subKey, subValue]) => {
              subAcc[subKey] = Math.round(subValue);
              return subAcc;
          }, {} as {[key: string]: number})
      };
      return acc;
  }, {} as ScoreBreakdown);
  
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const archetype = determineDeveloperArchetype(roundedBreakdown, user, repos, events, totalStars);

  return {
    score: Math.round(1000 - seriousnessScore),
    breakdown: roundedBreakdown,
    archetype: archetype,
  };
}