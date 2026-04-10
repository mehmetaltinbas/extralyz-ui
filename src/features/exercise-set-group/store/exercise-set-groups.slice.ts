import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ExerciseSetGroupService } from 'src/features/exercise-set-group/services/exercise-set-group.service';
import type { ExerciseSetGroup } from 'src/features/exercise-set-group/types/exercise-set-group.interface';

const fetchData = createAsyncThunk('exercise-set-groups/fetch-data', async () => {
    const response = await ExerciseSetGroupService.readAllByUserId();

    return response.exerciseSetGroups;
});

const initialState: ExerciseSetGroup[] = [];

const exerciseSetGroupsSlice = createSlice({
    name: 'exerciseSetGroups',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            if (state.length === 1 && action.payload === undefined) return [];

            return action.payload;
        });
    },
});

export const exerciseSetGroupsActions = {
    ...exerciseSetGroupsSlice.actions,
    fetchData,
};

export const exerciseSetGroupsReducer = exerciseSetGroupsSlice.reducer;
