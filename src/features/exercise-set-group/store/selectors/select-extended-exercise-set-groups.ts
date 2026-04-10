import { createSelector } from '@reduxjs/toolkit';
import { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import type { ExtendedExerciseSetGroup } from 'src/features/exercise-set-group/types/extended-exercise-set-group.interface';
import type { RootState } from 'src/store/store';

export const selectExtendedExerciseSetGroups = createSelector(
    (state: RootState) => state.exerciseSetGroups,
    (state: RootState) => state.exerciseSets,
    (groups, exerciseSets): ExtendedExerciseSetGroup[] =>
        groups.map((group) => ({
            ...group,
            exerciseSets: exerciseSets.filter(
                (es) => es.sourceType === ExerciseSetSourceType.GROUP && es.sourceId === group._id
            ),
        }))
);
