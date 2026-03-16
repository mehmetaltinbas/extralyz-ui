import { createSlice } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
}

const initialState: ThemeState = {
    mode: (localStorage.getItem('theme') as ThemeMode) || 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggle(state) {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
    },
});

export const themeActions = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
