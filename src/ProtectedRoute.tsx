import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from 'src/features/auth/services/auth.service';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function ProtectedRoute({ element }: { element: React.JSX.Element }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        authService
            .authorize()
            .then((response) => {
                setIsAuthenticated(response.isSuccess);
            })
            .catch((error) => {
                setIsAuthenticated(false);
            });
    }, []);

    return isAuthenticated === null ? (
        <LoadingPage />
    ) : isAuthenticated ? (
        element
    ) : (
        <Navigate to="/sign-in" />
    );
}
