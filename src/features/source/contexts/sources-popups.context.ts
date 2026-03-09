import React from 'react';

interface SourcesPopupsContextValue {
    openCreateSourceForm: () => void;
    openSourceActionMenu: (event: React.MouseEvent<HTMLButtonElement>, sourceId: string) => void;
}

export const SourcesPopupsContext = React.createContext<SourcesPopupsContextValue | null>(null);
