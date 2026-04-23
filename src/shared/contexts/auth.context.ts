import React from 'react';

export interface AuthContextValue {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    isAuthLoading: boolean;
    checkAuth: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);
