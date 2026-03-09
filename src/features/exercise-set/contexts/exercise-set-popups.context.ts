import React from 'react';

interface ExerciseSetPopupsContextValue {
    openCreateExerciseForm: () => void;
    openUpdateExerciseSetForm: () => void;
    openExerciseSetDeleteApproval: () => void;
    openExerciseActionMenu: (event: React.MouseEvent<HTMLButtonElement>, exerciseId: string) => void;
}

export const ExerciseSetPopupsContext = React.createContext<ExerciseSetPopupsContextValue | null>(null);
