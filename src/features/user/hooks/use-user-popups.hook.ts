import React from "react";
import { UserPopupsContext } from "src/features/user/contexts/user-popups.context";

export function useUserPopups() {
    const context = React.useContext(UserPopupsContext);

    if (!context) {
        throw new Error('useUserPopups must be used within a UserPopupsProvider');
    }

    return context;
}
