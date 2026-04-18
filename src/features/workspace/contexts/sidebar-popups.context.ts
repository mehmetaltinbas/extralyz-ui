import React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

interface SidebarPopupsContextValue {
    openSourceActionMenu: (event: React.MouseEvent<HTMLButtonElement>, sourceId: string) => void;
    openExerciseSetActionMenu: (event: React.MouseEvent<HTMLButtonElement>, exerciseSet: ExerciseSet) => void;
}

export const SidebarPopupsContext = React.createContext<SidebarPopupsContextValue | null>(null);
