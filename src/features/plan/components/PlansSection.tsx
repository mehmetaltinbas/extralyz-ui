import React from 'react';
import { PlanActionButton } from 'src/features/plan/components/PlanActionButton';
import { PlanCard } from 'src/features/plan/components/PlanCard';
import { usePlans } from 'src/features/plan/hooks/use-plans.hook';
import { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function PlansSection({
    onUpgradeClick,
    onDowngradeClick,
    onManagePaymentMethodsClick,
}: {
    onUpgradeClick: (planName: PlanName) => void;
    onDowngradeClick: (planName: PlanName) => void;
    onManagePaymentMethodsClick?: () => void;
}) {
    const dispatch = useAppDispatch();
    const subscription = useAppSelector((state) => state.subscription);
    const { plans, isLoading } = usePlans();

    const [isCancellingDowngrade, setIsCancellingDowngrade] = React.useState(false);

    const currentPlanName = subscription.subscription?.plan?.name ?? PlanName.FREE;
    const pendingPlanName = subscription.pendingSubscription?.plan?.name;
    const isCanceled = subscription.subscription?.status === SubscriptionStatus.CANCELED;

    async function handleCancelDowngrade() {
        setIsCancellingDowngrade(true);
        const response = await SubscriptionService.cancelDowngrade();
        if (response.isSuccess) {
            dispatch(subscriptionActions.fetchData());
        } else {
            alert(response.message);
        }
        setIsCancellingDowngrade(false);
    }

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Plans
                </h2>
                {onManagePaymentMethodsClick && (
                    <button
                        type="button"
                        onClick={onManagePaymentMethodsClick}
                        className="text-sm text-accent hover:underline"
                    >
                        Manage payment methods
                    </button>
                )}
            </div>

            {pendingPlanName && (
                <div className="flex items-center justify-between bg-surface-alt px-3 py-2 rounded-md text-sm gap-3 flex-wrap">
                    <span className="text-text-secondary">
                        Downgrading to{' '}
                        <span className="font-medium capitalize">{pendingPlanName}</span> at end of
                        billing cycle
                    </span>
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={handleCancelDowngrade}
                        disabled={isCancellingDowngrade}
                    >
                        Cancel Downgrade
                    </Button>
                </div>
            )}

            {isLoading ? (
                <p className="text-center text-text-secondary py-8">Loading plans...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            isCurrentPlan={plan.name === currentPlanName}
                            actionSlot={
                                <PlanActionButton
                                    plan={plan}
                                    currentPlanName={currentPlanName}
                                    isCanceled={isCanceled}
                                    onUpgradeClick={onUpgradeClick}
                                    onDowngradeClick={onDowngradeClick}
                                />
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
