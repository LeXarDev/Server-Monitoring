import { Profile } from '../types';
import { sanitizeInput, validatePassword } from '../utils/security';

const API_URL = '/api';  

// Secure token management
const TOKEN_KEY = 'token';
const RETRY_TIMEOUT = 60000; // 60 seconds
const MAX_RETRY_TIMEOUT = 600000; // 10 minutes max
let lastAttemptTime = 0;
let attemptCount = 0;
const MAX_ATTEMPTS = 5;
const RESET_AFTER = 300000; // 5 minutes

const secureStorage = {
    setToken(token: string) {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error('Error storing token:', e);
        }
    },
    getToken(): string | null {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error('Error retrieving token:', e);
            return null;
        }
    },
    clearTokens() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('user');
        } catch (e) {
            console.error('Error clearing tokens:', e);
        }
    }
};

async function getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = secureStorage.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

function resetAttempts() {
    const now = Date.now();
    if (lastAttemptTime && now - lastAttemptTime > RESET_AFTER) {
        attemptCount = 0;
        lastAttemptTime = 0;
    }
}

async function handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
        if (response.status === 429) {
            lastAttemptTime = Date.now();
            const retryAfter = response.headers.get('Retry-After');
            if (retryAfter) {
                const retrySeconds = parseInt(retryAfter);
                // Cap the retry time at MAX_RETRY_TIMEOUT
                const cappedRetrySeconds = Math.min(retrySeconds, MAX_RETRY_TIMEOUT / 1000);
                throw new Error(`RETRY_AFTER_${cappedRetrySeconds}`);
            }
            throw new Error('TOO_MANY_ATTEMPTS');
        }

        try {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        } catch (e) {
            // If response.json() fails, throw original error
            throw new Error('An error occurred while processing the response');
        }
    }

    return response.json();
}

function checkRetryTimeout(): void {
    resetAttempts();
    
    if (lastAttemptTime) {
        const timeSinceLastAttempt = Date.now() - lastAttemptTime;
        if (timeSinceLastAttempt < RETRY_TIMEOUT) {
            const remainingTime = Math.ceil((RETRY_TIMEOUT - timeSinceLastAttempt) / 1000);
            throw new Error(`RETRY_AFTER_${remainingTime}`);
        }
    }

    attemptCount++;
    if (attemptCount > MAX_ATTEMPTS) {
        lastAttemptTime = Date.now();
        throw new Error('TOO_MANY_ATTEMPTS');
    }
}

export const authService = {
    async register(username: string, email: string, password: string): Promise<any> {
        checkRetryTimeout();

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: await getHeaders(false),
            body: JSON.stringify({
                username: sanitizeInput(username),
                email: sanitizeInput(email),
                password
            })
        });

        return handleResponse(response);
    },

    async login(email: string, password: string): Promise<any> {
        checkRetryTimeout();

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: await getHeaders(false),
            body: JSON.stringify({
                email: sanitizeInput(email),
                password
            })
        });

        return handleResponse(response);
    },

    async loginWithAuth0(auth0Token: string): Promise<any> {
        const response = await fetch(`${API_URL}/auth/auth0`, {
            method: 'POST',
            headers: await getHeaders(false),
            body: JSON.stringify({ token: auth0Token })
        });

        return handleResponse(response);
    },

    async getProfile(userId: string): Promise<any> {
        const response = await fetch(`${API_URL}/profile/${userId}`, {
            method: 'GET',
            headers: await getHeaders()
        });

        const profile = await handleResponse(response);
        return {
            ...profile,
            avatar_url: profile.avatar_url || profile.picture || null
        };
    },

    async updateProfile(userId: string, profileData: Partial<Profile>): Promise<any> {
        const sanitizedData = Object.fromEntries(
            Object.entries(profileData).map(([key, value]) => [
                key,
                typeof value === 'string' ? sanitizeInput(value) : value
            ])
        ) as Partial<Profile>;

        const response = await fetch(`${API_URL}/profile/${userId}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(sanitizedData)
        });

        return handleResponse(response);
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<any> {
        if (!validatePassword(newPassword)) {
            throw new Error('New password does not meet security requirements');
        }

        checkRetryTimeout();

        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        return handleResponse(response);
    },

    async updateProfileImage(userId: string, formData: FormData): Promise<any> {
        const headers = await getHeaders();
        // حذف Content-Type لأن FormData سيضيفه تلقائياً
        delete headers['Content-Type'];
        
        const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
            method: 'POST',
            headers,
            body: formData
        });

        const result = await handleResponse(response);
        if (!result.avatar_url) {
            throw new Error('No avatar URL returned from server');
        }
        return result;
    },

    logout(): void {
        secureStorage.clearTokens();
    }
};
