import React, { useCallback, useEffect, useState } from 'react';
import { AuthService } from 'src/features/auth/services/auth.service';
import { AuthContext } from 'src/shared/contexts/auth.context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    const checkAuth = useCallback(async () => {
        setIsAuthLoading(true);
        try {
            const response = await AuthService.authorize();
            setIsAuthenticated(response.isSuccess);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAuthLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
