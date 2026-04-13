import React from 'react';

interface SourcePopupsContextValue {
    openCreateExerciseSetForm: (event: React.MouseEvent) => void;
    openUpdateSourceForm: (event: React.MouseEvent) => void;
    openDeleteApproval: (event: React.MouseEvent) => void;
    viewSourcePdf: (event: React.MouseEvent) => void;
    refreshData: () => void;
}

export const SourcePopupsContext = React.createContext<SourcePopupsContextValue | null>(null);
