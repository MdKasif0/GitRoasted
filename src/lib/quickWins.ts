

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
  progress?: number;
  progressLabel?: string;
  progressValue?: string;
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
  const popularRepos = repos.filter(r => r.stargazers_count >= 5);
  const reposWithoutReadme = popularRepos.filter(r => !hasReadme(r));
  if (reposWithoutReadme.length > 0) {
    const completedCount = popularRepos.length - reposWithoutReadme.length;
    wins.push({
      id: 'add-readme',
      title: `Add READMEs to popular repos`,
      description: `Improve your most visible projects with good documentation.`,
      pointsGain: reposWithoutReadme.length * 3,
      difficulty: 'easy',
      timeEstimate: '30 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: BookOpen,
      progress: (completedCount / popularRepos.length) * 100,
      progressLabel: 'Documented Repos',
      progressValue: `${completedCount}/${popularRepos.length}`
    });
  }

  // 2. Add bio to profile
  const hasBio = user.bio && user.bio.length >= 20;
  if (!hasBio) {
    wins.push({
      id: 'add-bio',
      title: 'Write a descriptive bio',
      description: 'A good bio helps people understand who you are and what you do.',
      pointsGain: 8,
      difficulty: 'easy',
      timeEstimate: '5 min',
      actionUrl: 'https://github.com/settings/profile',
      icon: User,
      progress: 0,
      progressLabel: 'Profile Bio',
    });
  }

  // 3. Add topics to repos
  const reposWithStars = repos.filter(r => r.stargazers_count > 0);
  const reposWithoutTopics = reposWithStars.filter(r => (!r.topics || r.topics.length === 0));
  if (reposWithoutTopics.length > 0) {
    const completedCount = reposWithStars.length - reposWithoutTopics.length;
    wins.push({
      id: 'add-topics',
      title: `Add topics to repos`,
      description: 'Topics improve discoverability in GitHub search.',
      pointsGain: reposWithoutTopics.length * 1,
      difficulty: 'easy',
      timeEstimate: '2 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: Tag,
      progress: (completedCount / reposWithStars.length) * 100,
      progressLabel: 'Tagged Repos',
      progressValue: `${completedCount}/${reposWithStars.length}`
    });
  }

  // 4. Add license to repos
  const publicRepos = repos.filter(r => !r.private);
  const reposWithoutLicense = publicRepos.filter(r => !r.license);
  if (reposWithoutLicense.length > 0) {
     const completedCount = publicRepos.length - reposWithoutLicense.length;
    wins.push({
      id: 'add-license',
      title: `Add license to public repos`,
      description: 'Open source licenses build trust and encourage contributions.',
      pointsGain: reposWithoutLicense.length * 2,
      difficulty: 'easy',
      timeEstimate: '5 min per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: BookCopy,
      progress: (completedCount / publicRepos.length) * 100,
      progressLabel: 'Licensed Repos',
      progressValue: `${completedCount}/${publicRepos.length}`
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
      description: `A consistent streak shows dedication and improves your activity score.`,
      pointsGain: 15,
      difficulty: 'medium',
      timeEstimate: '30 days',
      icon: Flame,
      progress: (currentStreak / 30) * 100,
      progressLabel: 'Current Streak',
      progressValue: `${currentStreak}/30 days`
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
      description: `Showcase your current activity by aiming for a higher contribution count.`,
      pointsGain: 12,
      difficulty: 'medium',
      timeEstimate: '1 month',
      icon: Zap,
      progress: (last30Days / 50) * 100,
      progressLabel: 'Contributions this month',
      progressValue: `${last30Days}/50`
    });
  }

  // 7. Complete profile (website, location, company)
  const missingFields = [];
  if (!user.blog) missingFields.push('website');
  if (!user.location) missingFields.push('location');
  if (!user.company) missingFields.push('company');
  
  if (missingFields.length > 0) {
    const totalFields = 3;
    const completedFields = totalFields - missingFields.length;
    wins.push({
      id: 'complete-profile',
      title: `Complete your GitHub profile`,
      description: `Fill out fields like website, location, and company to appear more professional.`,
      pointsGain: missingFields.length * 2,
      difficulty: 'easy',
      timeEstimate: '5 min',
      actionUrl: 'https://github.com/settings/profile',
      icon: User,
      progress: (completedFields / totalFields) * 100,
      progressLabel: 'Fields Completed',
      progressValue: `${completedFields}/${totalFields}`
    });
  }
  
  // 8. Add CI/CD to popular repos
  const popularReposForCI = repos.filter(r => r.stargazers_count >= 10);
  const reposWithoutCI = popularReposForCI.filter(r => !hasWorkflows(r));
  if (reposWithoutCI.length > 0) {
    const completedCount = popularReposForCI.length - reposWithoutCI.length;
    wins.push({
      id: 'add-ci',
      title: `Add GitHub Actions to popular repos`,
      description: 'Automated workflows (CI/CD) demonstrate professional development practices.',
      pointsGain: reposWithoutCI.length * 2,
      difficulty: 'medium',
      timeEstimate: '1-2 hours per repo',
      actionUrl: `https://github.com/${user.login}?tab=repositories`,
      icon: GitBranch,
      progress: (completedCount / popularReposForCI.length) * 100,
      progressLabel: 'Repos with CI',
      progressValue: `${completedCount}/${popularReposForCI.length}`
    });
  }
  
  // 9. Contribute to more languages
  const languageCount = new Set(repos.map(r => r.language).filter(Boolean)).size;
  if (languageCount < 5) {
    wins.push({
      id: 'learn-languages',
      title: `Contribute to ${5 - languageCount} more languages`,
      description: `Broaden your technical skills and showcase versatility by using more languages.`,
      pointsGain: (5 - languageCount) * 3,
      difficulty: 'hard',
      timeEstimate: '2-3 months per language',
      icon: Languages,
      progress: (languageCount / 5) * 100,
      progressLabel: 'Languages Used',
      progressValue: `${languageCount}/5`
    });
  }
  
  // 10. Improve follower ratio
  const ratio = user.followers / (user.following || 1);
  if (ratio < 1) {
    wins.push({
      id: 'improve-ratio',
      title: 'Build authentic following',
      description: `A ratio above 1 indicates you provide more value than you consume. Focus on quality content.`,
      pointsGain: 10,
      difficulty: 'hard',
      timeEstimate: '3-6 months',
      icon: Users,
      progress: ratio * 100,
      progressLabel: 'Follower/Following Ratio',
      progressValue: `${ratio.toFixed(2)}`
    });
  }
  
  // Sort by points (highest first) and return top 10
  return wins.sort((a, b) => b.pointsGain - a.pointsGain).slice(0, 10);
}
