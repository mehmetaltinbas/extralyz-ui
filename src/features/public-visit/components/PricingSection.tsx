import { useNavigate } from 'react-router-dom';
import { PlanActionButton } from 'src/features/plan/components/PlanActionButton';
import { PlanCard } from 'src/features/plan/components/PlanCard';
import { usePlans } from 'src/features/plan/hooks/use-plans.hook';
import { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { useAppSelector } from 'src/store/hooks';

export function PricingSection() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { plans, isLoading } = usePlans();
    const subscription = useAppSelector((state) => state.subscription);

    const currentPlanName = plans.find(plan => plan._id === subscription.currentSubscription?.planId)?.name ?? PlanName.FREE;
    const isCanceled = subscription.currentSubscription?.status === SubscriptionStatus.CANCELED;

    const goToBilling = () => navigate('/settings/billing');

    return (
        <section className="w-full flex flex-col items-center px-8 py-16 bg-surface-alt">
            <div className="max-w-5xl w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
                    <p className="text-text-secondary">
                        Start free. Upgrade whenever you need more.
                    </p>
                </div>

                {isLoading ? (
                    <p className="text-center text-text-secondary py-8">Loading plans...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan._id}
                                plan={plan}
                                isCurrentPlan={isAuthenticated && plan.name === currentPlanName}
                                actionSlot={
                                    isAuthenticated ? (
                                        <PlanActionButton
                                            plan={plan}
                                            currentPlanName={currentPlanName}
                                            isCanceled={isCanceled}
                                            onUpgradeClick={goToBilling}
                                            onDowngradeClick={goToBilling}
                                        />
                                    ) : (
                                        <Button
                                            variant={ButtonVariant.PRIMARY}
                                            size={ButtonSize.SM}
                                            onClick={() => navigate('/sign-up')}
                                        >
                                            Get started
                                        </Button>
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
