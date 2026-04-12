import React from 'react';

interface UserPopupsContextValue {
    openUpdateUserForm: () => void;
    openUpdatePasswordForm: () => void;
    openSendFeedbackForm: () => void;
}

export const UserPopupsContext = React.createContext<UserPopupsContextValue | null>(null);
