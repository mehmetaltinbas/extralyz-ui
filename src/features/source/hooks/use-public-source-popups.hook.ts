import React from "react";
import { PublicSourcePopupsContext } from "src/features/source/contexts/public-source-popups.context";

export function usePublicSourcePopups() {
    const context = React.useContext(PublicSourcePopupsContext);

    if (!context) {
        throw new Error('usePublicSourcePopups must be used within an PublicSourcePopupsProvider');
    }

    return context;
}
