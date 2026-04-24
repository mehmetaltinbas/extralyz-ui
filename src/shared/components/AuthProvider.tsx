import React, { useEffect, useRef } from 'react';
import { authActions } from 'src/features/auth/store/auth.slice';
import { paymentMethodActions } from 'src/features/payment-method/store/payment-method.slice';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import { userActions } from 'src/features/user/store/user.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isAuthLoading } = useAppSelector((state) => state.auth);
    const wasAuthenticatedRef = useRef<boolean>(false);

    useEffect(() => {
        dispatch(authActions.checkAuth());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthLoading) return;

        if (isAuthenticated) {
            dispatch(userActions.fetchData());
            dispatch(subscriptionActions.fetchData());
            dispatch(paymentMethodActions.fetchData());
            wasAuthenticatedRef.current = true;
        } else if (wasAuthenticatedRef.current) {
            dispatch(userActions.clear());
            dispatch(subscriptionActions.clear());
            dispatch(paymentMethodActions.clear());
            wasAuthenticatedRef.current = false;
        }
    }, [isAuthenticated, isAuthLoading, dispatch]);

    return <>{children}</>;
}
