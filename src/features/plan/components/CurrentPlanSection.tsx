import { PlanName } from 'src/features/plan/enums/plan-name.enum';
import { usePlans } from 'src/features/plan/hooks/use-plans.hook';
import { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import { useAppSelector } from 'src/store/hooks';

export function CurrentPlanSection() {
    const subscription = useAppSelector((state) => state.subscription.currentSubscription);
    const pendingSubscription = useAppSelector((state) => state.subscription.pendingSubscription);
    const creditBalance = useAppSelector((state) => state.user?.creditBalance ?? 0);

    const { plans } = usePlans();

    const planName = plans.find(plan => plan._id === subscription?.planId)?.name ?? PlanName.FREE;
    const nextBillingDate = subscription?.nextBillingDate
        ? new Date(subscription.nextBillingDate).toLocaleDateString()
        : '—';
    const status = subscription?.status ?? SubscriptionStatus.ACTIVE;

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase">
                Current plan
            </h2>

            <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-surface">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-semibold capitalize">{planName}</span>

                    <span className="text-xs font-medium text-accent px-2 py-0.5 border border-accent rounded-full capitalize">
                        {status}
                    </span>
                    {pendingSubscription?.planId && (
                        <span className="text-xs text-text-secondary">
                            → downgrading to{' '}
                            <span className="capitalize">{plans.find(plan => plan._id === pendingSubscription?.planId)?.name}</span>
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
                    <div>
                        Next {planName === PlanName.FREE ? 'renewal' : 'billing'} date:{' '}
                        <span className="text-text-primary">{nextBillingDate}</span>
                    </div>
                    <div>
                        Credits: <span className="text-text-primary">{creditBalance}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
