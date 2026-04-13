import React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

interface ExerciseSetsPopupsContextValue {
    openCreateExerciseSetForm: () => void;
    openCreateGroupForm: () => void;
    openExerciseSetActionMenu: (event: React.MouseEvent<HTMLButtonElement>, exerciseSet: ExerciseSet) => void;
    openGroupActionMenu: (event: React.MouseEvent<HTMLButtonElement>, groupId: string) => void;
}

export const ExerciseSetsPopupsContext = React.createContext<ExerciseSetsPopupsContextValue | null>(null);
