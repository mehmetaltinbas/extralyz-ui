import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SidebarMode = 'sidebar' | 'drawer';

interface SidebarState {
    isOpen: boolean;
    width: number;
    mode: SidebarMode;
}

const initialState: SidebarState = {
    isOpen: false,
    width: 50,
    mode: 'sidebar',
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        open: (state) => {
            state.isOpen = true;
            state.width = 300;
        },
        close: (state) => {
            state.isOpen = false;
            state.width = state.mode === 'drawer' ? 0 : 50;
        },
        resize: (state, action: PayloadAction<number>) => {
            if (state.mode === 'drawer') return;

            const payload = action.payload;

            if (payload > 200 && payload < 400) {
                state.width = payload;
            } else if (payload < 200) {
                if (payload < state.width && payload < 150) {
                    state.isOpen = false;
                    state.width = 50;
                } else if (payload > state.width && payload > 150) {
                    state.isOpen = true;
                    state.width = 200;
                }
            }
        },
        setMode: (state, action: PayloadAction<SidebarMode>) => {
            state.mode = action.payload;
            if (action.payload === 'drawer') {
                if (!state.isOpen) {
                    state.width = 0;
                }
            } else {
                if (!state.isOpen) {
                    state.width = 50;
                }
            }
        },
    },
});

export const sidebarActions = sidebarSlice.actions;

export const sidebarReducer = sidebarSlice.reducer;
