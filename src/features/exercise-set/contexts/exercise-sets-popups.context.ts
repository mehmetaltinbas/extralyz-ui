import React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

interface ExerciseSetsPopupsContextValue {
    openCreateExerciseSetForm: () => void;
    openExerciseSetActionMenu: (event: React.MouseEvent<HTMLButtonElement>, exerciseSet: ExerciseSet) => void;
}

export const ExerciseSetsPopupsContext = React.createContext<ExerciseSetsPopupsContextValue | null>(null);
