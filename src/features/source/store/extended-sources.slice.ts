import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExtendedSource } from 'src/features/source/types/extended-source.interface';

const fetchData = createAsyncThunk('extended-sources/fetch-data', async () => {
    const response = await exerciseSetService.readAllByUserIdGroupedBySources();

    return response.sources;
});

const initialState: ExtendedSource[] = [];

const extendedSourcesSlice = createSlice({
    name: 'extendedSources',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const extendedSourcesActions = {
    ...extendedSourcesSlice.actions,
    fetchData,
};

export const extendedSourcesReducer = extendedSourcesSlice.reducer;
