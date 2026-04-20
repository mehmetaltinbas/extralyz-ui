import React from 'react';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';
import { subscriptionActions } from 'src/features/subscription/store/subscription.slice';
import { userActions } from 'src/features/user/store/user.slice';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpgradeConfirmation({
    isHidden,
    onClose,
    targetPlanName,
}: {
    isHidden: boolean;
    onClose: () => void;
    targetPlanName: PlanName | null;
}) {
    const dispatch = useAppDispatch();

    const [priceToPay, setPriceToPay] = React.useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = React.useState(false);
    const [isUpgrading, setIsUpgrading] = React.useState(false);

    React.useEffect(() => {
        if (!isHidden && targetPlanName) {
            setIsLoadingPrice(true);
            setPriceToPay(null);
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
        if (!targetPlanName) return;

        setIsUpgrading(true);
        const response = await SubscriptionService.upgrade({ newPlanName: targetPlanName });

        if (response.isSuccess) {
            dispatch(subscriptionActions.fetchData());
            dispatch(userActions.fetchData());
            onClose();
        } else {
            alert(response.message);
        }
        setIsUpgrading(false);
    }

    if (!targetPlanName) return null;

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div
                className="flex flex-col gap-4 w-full max-w-[400px]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-center">Upgrade to {targetPlanName}</h2>

                {isLoadingPrice ? (
                    <p className="text-center text-text-secondary py-4">Calculating price...</p>
                ) : (
                    <>
                        {priceToPay !== null && priceToPay > 0 && (
                            <p className="text-center text-text-secondary">
                                You will be charged <span className="font-semibold text-text-primary">{priceToPay} TRY</span> (prorated for the remaining billing period).
                            </p>
                        )}

                        {priceToPay === 0 && (
                            <p className="text-center text-text-secondary">
                                No charge for this upgrade.
                            </p>
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
                                disabled={isUpgrading}
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
