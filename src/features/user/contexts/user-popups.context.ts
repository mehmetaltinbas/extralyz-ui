import React from 'react';

interface UserPopupsContextValue {
    openSendFeedbackForm: () => void;
}

export const UserPopupsContext = React.createContext<UserPopupsContextValue | null>(null);
