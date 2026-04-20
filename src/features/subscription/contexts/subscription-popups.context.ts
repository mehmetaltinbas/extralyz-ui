import React from 'react';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';

export interface SubscriptionPopupsContextValue {
    openPlanComparison: () => void;
    openUpgradeConfirmation: (planName: PlanName) => void;
    openDowngradeConfirmation: (planName: PlanName) => void;
}

export const SubscriptionPopupsContext = React.createContext<SubscriptionPopupsContextValue | null>(null);
