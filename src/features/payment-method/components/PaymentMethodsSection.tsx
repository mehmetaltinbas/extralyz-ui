import React from 'react';
import { AddPaymentMethodForm } from 'src/features/payment-method/components/AddPaymentMethodForm';
import { PaymentMethodRow } from 'src/features/payment-method/components/PaymentMethodRow';
import { usePlans } from 'src/features/plan/hooks/use-plans.hook';
import { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppSelector } from 'src/store/hooks';

export function PaymentMethodsSection({
    sectionRef,
    isAddOpen,
    onOpenAdd,
    onCloseAdd,
}: {
    sectionRef?: React.RefObject<HTMLDivElement | null>;
    isAddOpen: boolean;
    onOpenAdd: () => void;
    onCloseAdd: () => void;
}) {
    const paymentMethods = useAppSelector((state) => state.paymentMethod.paymentMethods);
    const isLoading = useAppSelector((state) => state.paymentMethod.isLoading);
    const subscription = useAppSelector((state) => state.subscription.currentSubscription);

    const { plans } = usePlans();

    const hasActivePaidSubscription =
        !!subscription && plans.find(plan => plan._id === subscription.planId)?.name !== PlanName.FREE &&
        (subscription.status === SubscriptionStatus.ACTIVE ||
            subscription.status === SubscriptionStatus.GRACE_PERIOD ||
            subscription.status === SubscriptionStatus.PENDING_ACTIVATE);

    const isLastCardLocked = paymentMethods.length === 1 && hasActivePaidSubscription;

    return (
        <section ref={sectionRef} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                Payment methods
            </h2>

            {isLoading && paymentMethods.length === 0 ? (
                <p className="text-sm text-text-secondary">Loading payment methods...</p>
            ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-text-secondary">No payment methods on file yet.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {paymentMethods.map((method) => {
                        const canDelete = !(isLastCardLocked && paymentMethods.length === 1);
                        return (
                            <PaymentMethodRow
                                key={method._id}
                                method={method}
                                canDelete={canDelete}
                                deleteBlockedReason={
                                    canDelete ? undefined : "You must have at least one payment method while your paid subscription is active."
                                }
                            />
                        );
                    })}
                </div>
            )}

            {isAddOpen ? (
                <div className="p-3 rounded-md border border-border bg-surface">
                    <AddPaymentMethodForm onCancel={onCloseAdd} onSuccess={onCloseAdd} />
                </div>
            ) : (
                <div>
                    <Button variant={ButtonVariant.OUTLINE} size={ButtonSize.SM} onClick={onOpenAdd}>
                        + Add payment method
                    </Button>
                </div>
            )}
        </section>
    );
}
