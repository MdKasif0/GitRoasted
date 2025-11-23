
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface Commit {
  sha: string;
  author: {
    email: string;
    name: string;
  };
  message: string;
  distinct: boolean;
  url: string;
}

export interface PushEventPayload {
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: Commit[];
}

export interface GitHubEvent {
  id: string;
  type: 'PushEvent' | string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: PushEventPayload | object;
  public: boolean;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: 'public' | 'private' | 'internal';
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export type ScoreBreakdown = {
  impact: number;
  consistency: number;
  quality: number;
  community: number;
  diversity: number;
  experience: number;
  activity: number;
  specialBonus: number;
};

export type RoastResultState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  username?: string;
  user?: GitHubUser;
  score?: number;
  breakdown?: ScoreBreakdown;
  roast?: string;
  message?: string;
  events?: GitHubEvent[];
  repos?: GitHubRepo[];
  totalStars?: number;
  topLanguages?: [string, number][];
};


export interface LeaderboardEntry {
  id?: string; // Firestore document ID
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  score: number;
  roastedAt: any; // Firestore Timestamp
}

export type StepStatus = 'pending' | 'active' | 'complete' | 'error' | 'skipped';

export interface FetchProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  stepName: string;
  stepStatus: StepStatus;
  estimatedTimeRemaining: number;
  dataCollected: {
    profile: boolean;
    repositories: boolean;
    activity: boolean;
    contributions: boolean;
    organizations: boolean;
    processing: boolean;
  };
  errors: Array<{
    step: string;
    message: string;
    severity: 'warning' | 'error';
  }>;
}
