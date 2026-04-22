import React from 'react';
import { PaymentMethodSelector } from 'src/features/payment-method/components/PaymentMethodSelector';
import { paymentMethodActions } from 'src/features/payment-method/store/payment-method.slice';
import { DEFAULT_CURRENCY } from 'src/features/payment/constants/default-currency.constant';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import { userActions } from 'src/features/user/store/user.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpgradeSubscriptionConfirmation({
    isHidden,
    onClose,
    targetPlanName,
    onRequestAddPaymentMethod,
}: {
    isHidden: boolean;
    onClose: () => void;
    targetPlanName: PlanName | null;
    onRequestAddPaymentMethod?: () => void;
}) {
    const dispatch = useAppDispatch();

    const [priceToPay, setPriceToPay] = React.useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = React.useState(false);
    const [isUpgrading, setIsUpgrading] = React.useState(false);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isHidden && targetPlanName) {
            setIsLoadingPrice(true);
            setPriceToPay(null);
            setSelectedPaymentMethodId(null);
            dispatch(paymentMethodActions.fetchData());

            SubscriptionService.checkPriceToPayOnUpgrade({ newPlanName: targetPlanName }).then(
                (response) => {
                    if (response.isSuccess && response.priceToPay !== undefined) {
                        setPriceToPay(response.priceToPay);
                    } else {
                        alert(response.message);
                        onClose();
                    }
                    setIsLoadingPrice(false);
                }
            );
        }
    }, [isHidden, targetPlanName]);

    async function handleUpgrade() {
        const needsPaymentMethod = (priceToPay ?? 0) > 0;
        const isMissingPaymentMethod = needsPaymentMethod && !selectedPaymentMethodId;

        if (targetPlanName) {
            if (isMissingPaymentMethod) {
                alert('Please select a payment method.');
            } else {
                setIsUpgrading(true);
                const response = await SubscriptionService.upgrade({
                    newPlanName: targetPlanName,
                    paymentMethodId: selectedPaymentMethodId ?? undefined,
                });

                if (response.isSuccess) {
                    dispatch(subscriptionActions.fetchData());
                    dispatch(userActions.fetchData());
                    onClose();
                } else {
                    alert(response.message);
                }
                setIsUpgrading(false);
            }
        }
    }

    const needsPaymentMethod = (priceToPay ?? 0) > 0;
    const isConfirmDisabled =
        isUpgrading || (needsPaymentMethod && !selectedPaymentMethodId);

    return !targetPlanName ? null : (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div
                className="flex flex-col gap-4 w-full max-w-[420px]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-center">Upgrade to {targetPlanName}</h2>

                {isLoadingPrice ? (
                    <p className="text-center text-text-secondary py-4">Calculating price...</p>
                ) : (
                    <>
                        {priceToPay !== null && priceToPay > 0 && (
                            <p className="text-center text-text-secondary">
                                You will be charged{' '}
                                <span className="font-semibold text-text-primary">
                                    {priceToPay} {DEFAULT_CURRENCY}
                                </span>{' '}
                                (prorated for the remaining billing period).
                            </p>
                        )}

                        {priceToPay === 0 && (
                            <p className="text-center text-text-secondary">
                                No charge for this upgrade.
                            </p>
                        )}

                        {needsPaymentMethod && (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">Payment method</p>
                                <PaymentMethodSelector
                                    selectedPaymentMethodId={selectedPaymentMethodId}
                                    onSelect={setSelectedPaymentMethodId}
                                    onAddNew={
                                        onRequestAddPaymentMethod
                                            ? () => {
                                                  onClose();
                                                  onRequestAddPaymentMethod();
                                              }
                                            : undefined
                                    }
                                />
                            </div>
                        )}

                        <div className="flex justify-center gap-2 pt-2">
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                size={ButtonSize.SM}
                                onClick={handleUpgrade}
                                disabled={isConfirmDisabled}
                            >
                                {isUpgrading ? 'Upgrading...' : 'Confirm Upgrade'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
