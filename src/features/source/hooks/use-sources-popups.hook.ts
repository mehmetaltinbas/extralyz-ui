import React from "react";
import { SourcesPopupsContext } from "src/features/source/contexts/sources-popups.context";

export function useSourcesPopups() {
    const context = React.useContext(SourcesPopupsContext);

    if (!context) {
        throw new Error('useSourcesPopups must be used within a SourcesPopupsProvider');
    }

    return context;
}
