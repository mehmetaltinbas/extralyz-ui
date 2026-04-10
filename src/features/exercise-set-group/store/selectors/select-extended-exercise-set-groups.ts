import { createSelector } from '@reduxjs/toolkit';
import type { ExtendedExerciseSetGroup } from 'src/features/exercise-set-group/types/extended-exercise-set-group.interface';
import { ExerciseSetContextType } from 'src/features/exercise-set/enums/exercise-set-context-type.enum';
import type { RootState } from 'src/store/store';

export const selectExtendedExerciseSetGroups = createSelector(
    (state: RootState) => state.exerciseSetGroups,
    (state: RootState) => state.exerciseSets,
    (groups, exerciseSets): ExtendedExerciseSetGroup[] =>
        groups.map((group) => ({
            ...group,
            exerciseSets: exerciseSets.filter(
                (es) => es.contextType === ExerciseSetContextType.GROUP && es.contextId === group._id
            ),
        }))
);
