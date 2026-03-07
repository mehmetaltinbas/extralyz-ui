import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

const fetchData = createAsyncThunk('exercise-sets/fetch-data', async () => {
    const response = await exerciseSetService.readAllByUserId();

    return response.exerciseSets;
});

const initialState: ExerciseSet[] = [];

const exerciseSetsSlice = createSlice({
    name: 'exerciseSets',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            if (state.length === 1 && action.payload === undefined) return [];

            return action.payload;
        });
    },
});

export const exerciseSetsActions = {
    ...exerciseSetsSlice.actions,
    fetchData,
};

export const exerciseSetsReducer = exerciseSetsSlice.reducer;
