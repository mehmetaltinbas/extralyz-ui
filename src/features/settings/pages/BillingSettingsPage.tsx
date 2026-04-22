import React from 'react';
import { PaymentMethodsSection } from 'src/features/payment-method/components/PaymentMethodsSection';
import { CurrentPlanSection } from 'src/features/plan/components/CurrentPlanSection';
import { PlansSection } from 'src/features/plan/components/PlansSection';
import { DowngradeConfirmation } from 'src/features/subscription/components/DowngradeConfirmation';
import { UpgradeSubscriptionConfirmation } from 'src/features/subscription/components/UpgradeSubscriptionConfirmation';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { BodyModal } from 'src/shared/components/BodyModal';

export function BillingSettingsPage() {
    const paymentMethodsSectionRef = React.useRef<HTMLDivElement | null>(null);

    const [upgradeTargetPlan, setUpgradeTargetPlan] = React.useState<PlanName | null>(null);
    const [downgradeTargetPlan, setDowngradeTargetPlan] = React.useState<PlanName | null>(null);
    const [isAddPaymentOpen, setIsAddPaymentOpen] = React.useState(false);

    const isAnyDialogOpen = upgradeTargetPlan !== null || downgradeTargetPlan !== null;

    function closeDialogs() {
        setUpgradeTargetPlan(null);
        setDowngradeTargetPlan(null);
    }

    function openAddPaymentMethod() {
        setIsAddPaymentOpen(true);
        requestAnimationFrame(() => {
            paymentMethodsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    return (
        <>
            <div className="w-full max-w-[900px] flex flex-col gap-8">
                <CurrentPlanSection />

                <PlansSection
                    onUpgradeClick={setUpgradeTargetPlan}
                    onDowngradeClick={setDowngradeTargetPlan}
                    onManagePaymentMethodsClick={() => {
                        paymentMethodsSectionRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    }}
                />

                <PaymentMethodsSection
                    sectionRef={paymentMethodsSectionRef}
                    isAddOpen={isAddPaymentOpen}
                    onOpenAdd={() => setIsAddPaymentOpen(true)}
                    onCloseAdd={() => setIsAddPaymentOpen(false)}
                />
            </div>

            <BodyModal
                isPopUpActive={isAnyDialogOpen}
                zIndex={60}
                onOverlayClick={closeDialogs}
                components={[
                    <UpgradeSubscriptionConfirmation
                        key="upgrade"
                        isHidden={upgradeTargetPlan === null}
                        onClose={closeDialogs}
                        targetPlanName={upgradeTargetPlan}
                        onRequestAddPaymentMethod={openAddPaymentMethod}
                    />,
                    <DowngradeConfirmation
                        key="downgrade"
                        isHidden={downgradeTargetPlan === null}
                        onClose={closeDialogs}
                        targetPlanName={downgradeTargetPlan}
                    />,
                ]}
            />
        </>
    );
}
