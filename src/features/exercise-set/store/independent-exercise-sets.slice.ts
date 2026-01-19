import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import { exerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

const fetchData = createAsyncThunk('independent-exercise-sets/fetch-data', async () => {
    const response = await exerciseSetService.readAllByUserId(ExerciseSetSourceType.INDEPENDENT);
    return response.exerciseSets;
});

const initialState: ExerciseSet[] = [];

const independentExerciseSetsSlice = createSlice({
    name: 'independentExerciseSets',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            if (state.length === 1 && action.payload === undefined) {return [];}
            return action.payload;
        });
    },
});

export const independentExerciseSetsActions = {
    ...independentExerciseSetsSlice.actions,
    fetchData,
};

export const independentExerciseSetsReducer = independentExerciseSetsSlice.reducer;
