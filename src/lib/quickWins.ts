
import type { GitHubUser, GitHubRepo, GitHubEvent, RoastResultState } from './types';
import { differenceInDays } from 'date-fns';
import { BookOpen, Tag, BookCopy, Flame, Zap, User, GitBranch, Languages, Users } from 'lucide-react';

export interface QuickWin {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  pointsGain: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  actionUrl?: string;
  completed?: boolean;
}

// This function is a placeholder as the GitHub API doesn't provide this directly.
// A more robust solution would involve fetching repo contents.
const hasReadme = (repo: GitHubRepo) => !!repo.description;
const hasWorkflows = (repo: GitHubRepo) => false; // Placeholder

export function calculateQuickWins(userData: RoastResultState): QuickWin[] {
    if(userData.status !== 'success' || !userData.user || !userData.repos || !userData.events) return [];

  const { user, repos, events } = userData;
  const wins: QuickWin[] = [];

  // 1. Missing README files (approximated with missing description)
  const reposWithoutReadme = repos.filter(r => !hasReadme(r) && r.stargazers_count >= 5);
  if (reposWithoutReadme.length > 0) {
    wins.push({
      id: 'add-readme',
      title: `Add README to ${reposWithoutReadme.length} repos`,
      description: `${reposWithoutReadme.length} repositories with 5+ stars need documentation.`,
      pointsGain: reposWithoutReadme.length * 3,
      difficulty: 'easy',
      timeEstimate: '30 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: BookOpen,
    });
  }

  // 2. Add bio to profile
  if (!user.bio || user.bio.length < 20) {
    wins.push({
      id: 'add-bio',
      title: 'Write a descriptive bio',
      description: 'A good bio helps people understand who you are.',
      pointsGain: 8,
      difficulty: 'easy',
      timeEstimate: '5 min',
      actionUrl: 'https://github.com/settings/profile',
      icon: User,
    });
  }

  // 3. Add topics to repos
  const reposWithoutTopics = repos.filter(r => (!r.topics || r.topics.length === 0) && r.stargazers_count > 0);
  if (reposWithoutTopics.length > 0) {
    wins.push({
      id: 'add-topics',
      title: `Add topics to ${reposWithoutTopics.length} repos`,
      description: 'Topics improve discoverability in GitHub search.',
      pointsGain: reposWithoutTopics.length * 1,
      difficulty: 'easy',
      timeEstimate: '2 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: Tag,
    });
  }

  // 4. Add license to repos
  const reposWithoutLicense = repos.filter(r => !r.license && !r.private);
  if (reposWithoutLicense.length > 0) {
    wins.push({
      id: 'add-license',
      title: `Add license to ${reposWithoutLicense.length} repos`,
      description: 'Open source licenses build trust and encourage contributions.',
      pointsGain: reposWithoutLicense.length * 2,
      difficulty: 'easy',
      timeEstimate: '5 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: BookCopy,
    });
  }

  // 5. Build contribution streak
  const pushEvents = events.filter(e => e.type === 'PushEvent');
  const contributionDates = pushEvents.map(e => new Date(e.created_at));
  let currentStreak = 0;
  if(contributionDates.length > 0) {
      contributionDates.sort((a, b) => b.getTime() - a.getTime());
      let lastDate = new Date();
      if(differenceInDays(lastDate, contributionDates[0]) > 1) {
          currentStreak = 0;
      } else {
          currentStreak = 1;
          lastDate = contributionDates[0];
          for(let i = 1; i < contributionDates.length; i++) {
              const diff = differenceInDays(lastDate, contributionDates[i]);
              if(diff === 1) {
                  currentStreak++;
                  lastDate = contributionDates[i];
              } else if (diff > 1) {
                  break;
              }
          }
      }
  }

  if (currentStreak < 30) {
    wins.push({
      id: 'build-streak',
      title: 'Build a 30-day contribution streak',
      description: `Current: ${currentStreak} days. Aim for 30+ to show consistency.`,
      pointsGain: 15,
      difficulty: 'medium',
      timeEstimate: '30 days',
      icon: Flame,
    });
  }

  // 6. Increase recent activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30Days = pushEvents.filter(e => new Date(e.created_at) > thirtyDaysAgo).length;
  if (last30Days < 50) {
    wins.push({
      id: 'increase-activity',
      title: 'Make 50+ contributions this month',
      description: `You've made ${last30Days} contributions. Push for 50+ to show activity.`,
      pointsGain: 12,
      difficulty: 'medium',
      timeEstimate: '1 month',
      icon: Zap,
    });
  }

  // 7. Complete profile (website, location, company)
  const missingFields = [];
  if (!user.blog) missingFields.push('website');
  if (!user.location) missingFields.push('location');
  if (!user.company) missingFields.push('company');
  
  if (missingFields.length > 0) {
    wins.push({
      id: 'complete-profile',
      title: `Add ${missingFields.join(', ')} to profile`,
      description: 'Complete profiles appear more professional.',
      pointsGain: missingFields.length * 2,
      difficulty: 'easy',
      timeEstimate: '5 min',
      actionUrl: 'https://github.com/settings/profile',
      icon: User,
    });
  }
  
  // 8. Add CI/CD to popular repos
  const reposWithoutCI = repos.filter(r => !hasWorkflows(r) && r.stargazers_count >= 10);
  if (reposWithoutCI.length > 0) {
    wins.push({
      id: 'add-ci',
      title: `Add GitHub Actions to ${reposWithoutCI.length} repos`,
      description: 'CI/CD shows professional development practices.',
      pointsGain: reposWithoutCI.length * 2,
      difficulty: 'medium',
      timeEstimate: '1-2 hours per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: GitBranch,
    });
  }
  
  // 9. Contribute to more languages
  const languageCount = new Set(repos.map(r => r.language).filter(Boolean)).size;
  if (languageCount < 5) {
    wins.push({
      id: 'learn-languages',
      title: `Learn ${5 - languageCount} more programming languages`,
      description: `Currently using ${languageCount} languages. Aim for 5+ to show versatility.`,
      pointsGain: (5 - languageCount) * 3,
      difficulty: 'hard',
      timeEstimate: '2-3 months per language',
      icon: Languages,
    });
  }
  
  // 10. Improve follower ratio
  const ratio = user.followers / (user.following || 1);
  if (ratio < 1) {
    wins.push({
      id: 'improve-ratio',
      title: 'Build authentic following',
      description: `Current follower/following ratio: ${ratio.toFixed(2)}. Focus on quality content.`,
      pointsGain: 10,
      difficulty: 'hard',
      timeEstimate: '3-6 months',
      icon: Users,
    });
  }
  
  // Sort by points (highest first) and return top 10
  return wins.sort((a, b) => b.pointsGain - a.pointsGain).slice(0, 10);
}
