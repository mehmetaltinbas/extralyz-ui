import React from 'react';

interface UserPopupsContextValue {
    openUpdateUserForm: () => void;
    openUpdatePasswordForm: () => void;
}

export const UserPopupsContext = React.createContext<UserPopupsContextValue | null>(null);
