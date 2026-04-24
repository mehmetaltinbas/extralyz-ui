import { authActions } from 'src/features/auth/store/auth.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isAuthLoading } = useAppSelector((state) => state.auth);

    return {
        isAuthenticated,
        isAuthLoading,
        setIsAuthenticated: (value: boolean) => dispatch(authActions.setIsAuthenticated(value)),
        checkAuth: () => dispatch(authActions.checkAuth()).unwrap().then(() => undefined),
    };
}
