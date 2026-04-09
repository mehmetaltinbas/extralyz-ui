import React from 'react';

interface ExerciseSetPopupsContextValue {
    openCreateExerciseForm: () => void;
    openStartPracticeDecision: () => void;
    openViewPdfDecision: () => void;
    openUpdateExerciseSetForm: () => void;
    openExerciseSetDeleteApproval: () => void;
    openChangeSourceForm: () => void;
    openGenerateNotesForm: () => void;
    openExerciseActionMenu: (event: React.MouseEvent<HTMLButtonElement>, exerciseId: string) => void;
}

export const ExerciseSetPopupsContext = React.createContext<ExerciseSetPopupsContextValue | null>(null);
