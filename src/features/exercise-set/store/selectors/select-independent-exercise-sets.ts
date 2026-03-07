import { createSelector } from '@reduxjs/toolkit';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import type { RootState } from 'src/store/store';

export const selectIndependentExerciseSets = createSelector(
    (state: RootState) => state.exerciseSets,
    (exerciseSets) =>
        exerciseSets.filter(
            (es) => es.sourceType === ExerciseSetSourceType.INDEPENDENT
        )
);
