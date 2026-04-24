import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { checkAuth } from 'src/features/auth/store/check-auth.thunk';

interface AuthState {
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload;
                state.isAuthLoading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.isAuthLoading = false;
            });
    },
});

export const authActions = {
    ...authSlice.actions,
    checkAuth,
};

export const authReducer = authSlice.reducer;
