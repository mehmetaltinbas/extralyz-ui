import React from 'react';

interface PublicSourcePopupsContextValue {
    openCloneSourceForm: () => void;
}

export const PublicSourcePopupsContext = React.createContext<PublicSourcePopupsContextValue | null>(null);
