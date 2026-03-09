import React from "react";
import { SourcePopupsContext } from "src/features/source/contexts/source-popups.context";

export function useSourcePopups() {
    const context = React.useContext(SourcePopupsContext);

    if (!context) {
        throw new Error('useSourcePopups must be used within a SourcePopupsProvider');
    }

    return context;
}
