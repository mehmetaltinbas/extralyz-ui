import React from 'react';
import { PLAN_ORDER } from 'src/features/subscription/constants/plan-order.constant';
import { PLAN_TIER_RANK } from 'src/features/subscription/constants/plan-tier-rank.constant';
import { PLUS_FEATURES } from 'src/features/subscription/constants/plus-features.constant';
import { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import { useSubscriptionPopups } from 'src/features/subscription/hooks/use-subscription-popups.hook';
import { PlanService } from 'src/features/subscription/services/plan.service';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import type { Plan } from 'src/features/subscription/types/plan.interface';
import { formatLimit } from 'src/features/subscription/utils/format-limit.util';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function PlanComparisonModal({
    isHidden,
    onClose,
}: {
    isHidden: boolean;
    onClose: () => void;
}) {
    const dispatch = useAppDispatch();
    const subscription = useAppSelector((state) => state.subscription);
    const { openUpgradeConfirmation, openDowngradeConfirmation } = useSubscriptionPopups();

    const [plans, setPlans] = React.useState<Plan[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCancellingDowngrade, setIsCancellingDowngrade] = React.useState(false);

    const currentPlanName = subscription.subscription?.plan?.name ?? PlanName.FREE;
    const pendingPlanName = subscription.pendingSubscription?.plan?.name;
    const isCanceled = subscription.subscription?.status === SubscriptionStatus.CANCELED;

    React.useEffect(() => {
        if (!isHidden && plans.length === 0) {
            setIsLoading(true);
            PlanService.readAll().then((response) => {
                if (response.isSuccess && response.plans) {
                    const sorted = [...response.plans].sort(
                        (a, b) => PLAN_ORDER.indexOf(a.name) - PLAN_ORDER.indexOf(b.name)
                    );
                    setPlans(sorted);
                }
                setIsLoading(false);
            });
        }
    }, [isHidden]);

    async function handleCancelDowngrade() {
        setIsCancellingDowngrade(true);
        const response = await SubscriptionService.cancelDowngrade();
        if (response.isSuccess) {
            dispatch(subscriptionActions.fetchData());
            onClose();
        } else {
            alert(response.message);
        }
        setIsCancellingDowngrade(false);
    }

    function renderPlanAction(plan: Plan) {
        const isCurrentPlan = plan.name === currentPlanName;
        const planRank = PLAN_TIER_RANK[plan.name];
        const currentRank = PLAN_TIER_RANK[currentPlanName];

        if (isCurrentPlan) {
            return (
                <span className="text-xs font-medium text-accent px-3 py-1.5 border border-accent rounded-full">
                    Current Plan
                </span>
            );
        }

        if (planRank > currentRank) {
            return (
                <Button
                    variant={ButtonVariant.PRIMARY}
                    size={ButtonSize.SM}
                    onClick={() => {
                        onClose();
                        openUpgradeConfirmation(plan.name);
                    }}
                >
                    Upgrade
                </Button>
            );
        }

        if (planRank < currentRank) {
            return (
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={() => {
                        onClose();
                        openDowngradeConfirmation(plan.name);
                    }}
                    disabled={isCanceled}
                >
                    Downgrade
                </Button>
            );
        }

        return null;
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div
                className="flex flex-col gap-4 w-full max-w-[700px]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-center">Choose Your Plan</h2>

                {pendingPlanName && (
                    <div className="flex items-center justify-between bg-surface-alt px-3 py-2 rounded-md text-sm">
                        <span className="text-text-secondary">
                            Downgrading to <span className="font-medium capitalize">{pendingPlanName}</span> at end of billing cycle
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
                        {plans.map((plan) => {
                            const isCurrentPlan = plan.name === currentPlanName;

                            return (
                                <div
                                    key={plan._id}
                                    className={`flex flex-col gap-3 p-4 rounded-lg border ${
                                        isCurrentPlan
                                            ? 'border-accent bg-surface'
                                            : 'border-border bg-surface'
                                    }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-base font-semibold capitalize">{plan.name}</h3>
                                        <p className="text-xl font-bold">
                                            {plan.monthlyPrice === 0
                                                ? 'Free'
                                                : `${plan.monthlyPrice} ${plan.currency}/mo`}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1.5 text-sm text-text-secondary">
                                        <p>{plan.monthlyCredits} credits/month</p>
                                        <p>Max {plan.maximumCredits} credits</p>
                                        <p>{formatLimit(plan.maxSources)} sources</p>
                                        <p>{formatLimit(plan.maxExerciseSets)} exercise sets</p>
                                    </div>

                                    {PLAN_TIER_RANK[plan.name] >= PLAN_TIER_RANK[PlanName.PLUS] && (
                                        <div className="flex flex-col gap-1 text-sm border-t border-border pt-2">
                                            {PLUS_FEATURES.map((feature) => (
                                                <p key={feature} className="text-text-secondary">
                                                    + {feature}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-2 flex justify-center">
                                        {renderPlanAction(plan)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
}
