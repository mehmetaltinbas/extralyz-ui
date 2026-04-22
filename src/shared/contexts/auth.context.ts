import React from 'react';

export interface AuthContextValue {
    isAuthenticated: boolean | null;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
    isAuthLoading: boolean;
    checkAuth: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);
