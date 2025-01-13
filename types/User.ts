import type { Profile } from './index';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  nickname?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  updated_at?: string;
  email_verified?: boolean;
  sub?: string;
  profile?: Profile;
}

export interface AuthResponse {
  token: string;
  user: User;
}
