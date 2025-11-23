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

export type RoastResultState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  user?: GitHubUser;
  score?: number;
  roast?: string;
  message?: string;
};

export interface LeaderboardEntry {
  rank: number;
  avatarUrl: string;
  username: string;
  score: number;
}
