export type { User } from './User';

export interface Profile {
    id: number;
    user_id: number;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    created_at: string;
    updated_at: string;
}

export interface Server {
    id: number;
    user_id: number;
    name: string;
    url: string;
    status: string;
    last_ping: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoginHistory {
    id: number;
    user_id: number;
    ip_address: string | null;
    user_agent: string | null;
    login_time: string;
}
