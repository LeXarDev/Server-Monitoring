import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, AuthResponse } from '../types/User';
import { authService } from '../services/auth';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (response: AuthResponse) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: auth0User, isAuthenticated: auth0IsAuthenticated, logout: auth0Logout, getAccessTokenSilently } = useAuth0();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                
                // Fetch fresh profile data in the background
                authService.getProfile(parsedUser.id)
                    .then(profile => {
                        const updatedUser = {
                            ...parsedUser,
                            avatar_url: profile.avatar_url || profile.picture || parsedUser.avatar_url || undefined
                        };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    })
                    .catch(console.error);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            if (auth0IsAuthenticated && auth0User) {
                try {
                    const token = await getAccessTokenSilently();
                    // First set the basic user data
                    const initialUserData: User = {
                        id: auth0User.sub!,
                        email: auth0User.email!,
                        username: auth0User.nickname || auth0User.email!.split('@')[0],
                        name: auth0User.name,
                        avatar_url: auth0User.picture || undefined
                    };
                    setUser(initialUserData);
                    setIsAuthenticated(true);
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(initialUserData));

                    // Then get the complete profile from our backend
                    try {
                        const profile = await authService.getProfile(auth0User.sub!);
                        const updatedUserData: User = {
                            ...initialUserData,
                            avatar_url: profile.avatar_url || profile.picture || auth0User.picture || undefined
                        };
                        setUser(updatedUserData);
                        localStorage.setItem('user', JSON.stringify(updatedUserData));
                    } catch (error) {
                        console.error('Error fetching complete profile:', error);
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                }
            }
        };

        initializeAuth();
    }, [auth0User, auth0IsAuthenticated, getAccessTokenSilently]);

    const login = async (response: AuthResponse) => {
        // First set the user data from the login response
        const initialUserData: User = {
            ...response.user,
            avatar_url: response.user.avatar_url || response.user.picture || undefined
        };
        
        setUser(initialUserData);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(initialUserData));

        // Then get the complete profile
        try {
            const profile = await authService.getProfile(response.user.id);
            const updatedUserData: User = {
                ...initialUserData,
                avatar_url: profile.avatar_url || profile.picture || response.user.avatar_url || undefined
            };
            setUser(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
        } catch (error) {
            console.error('Error fetching complete profile after login:', error);
        }
    };

    const logout = async () => {
        if (auth0IsAuthenticated) {
            await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
        } else {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/';
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!user) return;
        
        const updatedUser = {
            ...user,
            ...userData,
            avatar_url: userData.avatar_url || user.avatar_url || undefined
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
