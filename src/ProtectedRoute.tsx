import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function ProtectedRoute({ element }: { element: React.JSX.Element }) {
    const { isAuthenticated, isAuthLoading } = useAuth();

    return isAuthLoading ? (
        <LoadingPage />
    ) : isAuthenticated ? (
        element
    ) : (
        <Navigate to="/sign-in" />
    );
}
