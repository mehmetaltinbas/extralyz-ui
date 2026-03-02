import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Dimensions {
    width?: number;
    height?: number;
}

interface LayoutDimensionsState {
    mainColumn: Dimensions;
    exerciseSetsContainer: Dimensions;
    workspaceBody: Dimensions;
}

const initialState: LayoutDimensionsState = {
    mainColumn: {},
    exerciseSetsContainer: {},
    workspaceBody: {},
};

const layoutDimensions = createSlice({
    name: 'layoutDimensions',
    initialState,
    reducers: {
        updateWidthsBySidebarWidth: (state, action: PayloadAction<number>) => {
            const sidebarWidth = action.payload;

            state.mainColumn.width = window.innerWidth - sidebarWidth;
            state.exerciseSetsContainer.width = (window.innerWidth - sidebarWidth) * 0.9 - 64;
        },
        updateDimension: (
            state,
            action: PayloadAction<{
                layout: keyof LayoutDimensionsState;
                dimension: keyof Dimensions;
                value: number;
            }>
        ) => {
            const { layout, dimension, value } = action.payload;

            state[layout][dimension] = value;
        },
    },
});

export const layoutDimensionsActions = layoutDimensions.actions;

export const layoutDimensionsReducer = layoutDimensions.reducer;
