import React from 'react';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function DowngradeConfirmation({
    isHidden,
    onClose,
    targetPlanName,
}: {
    isHidden: boolean;
    onClose: () => void;
    targetPlanName: PlanName | null;
}) {
    const dispatch = useAppDispatch();
    const subscription = useAppSelector((state) => state.subscription.subscription);

    const [isDowngrading, setIsDowngrading] = React.useState(false);

    async function handleDowngrade() {
        if (!targetPlanName) return;

        setIsDowngrading(true);
        const response = await SubscriptionService.downgrade({ newPlanName: targetPlanName });

        if (response.isSuccess) {
            dispatch(subscriptionActions.fetchData());
            onClose();
        } else {
            alert(response.message);
        }
        setIsDowngrading(false);
    }

    if (!targetPlanName) return null;

    const nextBillingDate = subscription?.nextBillingDate
        ? new Date(subscription.nextBillingDate).toLocaleDateString()
        : 'the end of your billing cycle';

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div
                className="flex flex-col gap-4 w-full max-w-[400px]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-center">Downgrade to {targetPlanName}</h2>

                <p className="text-center text-text-secondary">
                    Your plan will change to <span className="font-semibold capitalize text-text-primary">{targetPlanName}</span> on{' '}
                    <span className="font-semibold text-text-primary">{nextBillingDate}</span>.
                    You will keep your current plan benefits until then.
                </p>

                <p className="text-center text-sm text-text-secondary">
                    Your existing content will not be deleted, but you won't be able to create new items beyond the lower plan's limits.
                </p>

                <div className="flex justify-center gap-2 pt-2">
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.SM}
                        onClick={handleDowngrade}
                        disabled={isDowngrading}
                    >
                        {isDowngrading ? 'Downgrading...' : 'Confirm Downgrade'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
