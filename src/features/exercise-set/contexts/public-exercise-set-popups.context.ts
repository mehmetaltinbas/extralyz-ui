import React from 'react';

interface PublicExerciseSetPopupsContextValue {
    openStartPracticeDecision: () => void;
    openCloneExerciseSetForm: () => void;
    openViewPdfDecision: () => void;
}

export const PublicExerciseSetPopupsContext = React.createContext<PublicExerciseSetPopupsContextValue | null>(null);
