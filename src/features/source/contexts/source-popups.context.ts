import React from 'react';

interface SourcePopupsContextValue {
    openSourceActionMenu: (event: React.MouseEvent) => void;
}

export const SourcePopupsContext = React.createContext<SourcePopupsContextValue | null>(null);
