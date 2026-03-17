import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Dimensions {
    width?: number;
    height?: number;
}

interface LayoutDimensionsState {
    mainColumn: Dimensions;
    workspaceBody: Dimensions;
}

const initialState: LayoutDimensionsState = {
    mainColumn: {},
    workspaceBody: {},
};

const layoutDimensions = createSlice({
    name: 'layoutDimensions',
    initialState,
    reducers: {
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
