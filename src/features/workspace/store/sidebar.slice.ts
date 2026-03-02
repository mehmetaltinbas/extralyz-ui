import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
    isOpen: boolean;
    width: number;
}

const initialState: SidebarState = {
    isOpen: false,
    width: 50,
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
            state.width = 50;
        },
        resize: (state, action: PayloadAction<number>) => {
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
    },
});

export const sidebarActions = sidebarSlice.actions;

export const sidebarReducer = sidebarSlice.reducer;
