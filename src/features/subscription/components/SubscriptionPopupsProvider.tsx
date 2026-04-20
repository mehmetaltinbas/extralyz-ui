import React from 'react';
import { DowngradeConfirmation } from 'src/features/subscription/components/DowngradeConfirmation';
import { PlanComparisonModal } from 'src/features/subscription/components/PlanComparisonModal';
import { UpgradeConfirmation } from 'src/features/subscription/components/UpgradeConfirmation';
import { SubscriptionPopupsContext } from 'src/features/subscription/contexts/subscription-popups.context';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { BodyModal } from 'src/shared/components/BodyModal';

export function SubscriptionPopupsProvider({ children }: { children: React.ReactNode }) {
    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isPlanComparisonHidden, setIsPlanComparisonHidden] = React.useState(true);
    const [isUpgradeHidden, setIsUpgradeHidden] = React.useState(true);
    const [isDowngradeHidden, setIsDowngradeHidden] = React.useState(true);
    const [targetPlanName, setTargetPlanName] = React.useState<PlanName | null>(null);

    function openPlanComparison() {
        setIsPopUpActive(true);
        setIsPlanComparisonHidden(false);
    }

    function openUpgradeConfirmation(planName: PlanName) {
        setTargetPlanName(planName);
        setIsPopUpActive(true);
        setIsUpgradeHidden(false);
    }

    function openDowngradeConfirmation(planName: PlanName) {
        setTargetPlanName(planName);
        setIsPopUpActive(true);
        setIsDowngradeHidden(false);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsPlanComparisonHidden(true);
        setIsUpgradeHidden(true);
        setIsDowngradeHidden(true);
    }

    return (
        <SubscriptionPopupsContext.Provider
            value={{ openPlanComparison, openUpgradeConfirmation, openDowngradeConfirmation }}
        >
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                zIndex={60}
                onOverlayClick={closePopups}
                components={[
                    <PlanComparisonModal
                        key="plan-comparison"
                        isHidden={isPlanComparisonHidden}
                        onClose={closePopups}
                    />,
                    <UpgradeConfirmation
                        key="upgrade"
                        isHidden={isUpgradeHidden}
                        onClose={closePopups}
                        targetPlanName={targetPlanName}
                    />,
                    <DowngradeConfirmation
                        key="downgrade"
                        isHidden={isDowngradeHidden}
                        onClose={closePopups}
                        targetPlanName={targetPlanName}
                    />,
                ]}
            />
        </SubscriptionPopupsContext.Provider>
    );
}
