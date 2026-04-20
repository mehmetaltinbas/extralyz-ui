import React from 'react';
import { SubscriptionPopupsContext } from 'src/features/subscription/contexts/subscription-popups.context';

export function useSubscriptionPopups() {
    const context = React.useContext(SubscriptionPopupsContext);

    if (!context) {
        throw new Error('useSubscriptionPopups must be used within a SubscriptionPopupsProvider');
    }

    return context;
}
