import { useCallback, useEffect, useState } from 'react';
import { AuthService } from 'src/features/auth/services/auth.service';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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

    return { 
        isAuthenticated, 
        setIsAuthenticated,
        isAuthLoading, 
        checkAuth,
    };
}
