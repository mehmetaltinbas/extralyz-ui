import { createSelector } from '@reduxjs/toolkit';
import { ExerciseSetContextType } from 'src/features/exercise-set/enums/exercise-set-context-type.enum';
import type { RootState } from 'src/store/store';

export const selectIndependentExerciseSets = createSelector(
    (state: RootState) => state.exerciseSets,
    (exerciseSets) =>
        exerciseSets.filter(
            (es) => es.contextType === ExerciseSetContextType.INDEPENDENT
        )
);
