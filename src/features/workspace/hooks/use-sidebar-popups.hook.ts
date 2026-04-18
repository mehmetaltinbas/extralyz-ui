import React from 'react';
import { SidebarPopupsContext } from 'src/features/workspace/contexts/sidebar-popups.context';

export function useSidebarPopups() {
    const context = React.useContext(SidebarPopupsContext);

    if (!context) {
        throw new Error('useSidebarPopups must be used within a SidebarPopupsProvider');
    }

    return context;
}
