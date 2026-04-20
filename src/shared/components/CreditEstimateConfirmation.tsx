import React from 'react';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import type { EstimateResponse } from 'src/shared/types/estimate.response';
import { useAppSelector } from 'src/store/hooks';

export function CreditEstimateConfirmation({
    isHidden,
    onClose,
    estimateFn,
    onConfirm,
}: {
    isHidden: boolean;
    onClose: () => void;
    estimateFn: () => Promise<EstimateResponse>;
    onConfirm: () => Promise<void>;
}) {
    const creditBalance = useAppSelector((state) => state.user?.creditBalance ?? 0);

    const [estimate, setEstimate] = React.useState<EstimateResponse | null>(null);
    const [isLoadingEstimate, setIsLoadingEstimate] = React.useState(false);
    const [isConfirming, setIsConfirming] = React.useState(false);

    React.useEffect(() => {
        if (!isHidden) {
            setEstimate(null);
            setIsLoadingEstimate(true);
            estimateFn().then((response) => {
                if (response.isSuccess) {
                    setEstimate(response);
                } else {
                    alert(response.message);
                    onClose();
                }
                setIsLoadingEstimate(false);
            });
        }
    }, [isHidden]);

    async function handleConfirm() {
        setIsConfirming(true);
        await onConfirm();
        setIsConfirming(false);
    }

    const credits = estimate?.credits ?? 0;
    const isInsufficient = credits > creditBalance;

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div
                className="flex flex-col gap-4 w-full max-w-[400px]"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-center">Credit Cost Estimate</h2>

                {isLoadingEstimate ? (
                    <p className="text-center text-text-secondary py-4">Calculating cost...</p>
                ) : (
                    <>
                        <div className="flex flex-col gap-2 text-center">
                            <p className="text-text-secondary">
                                This operation will cost{' '}
                                <span className="font-semibold text-text-primary">{credits}</span>{' '}
                                credits
                            </p>
                            <p className="text-sm text-text-secondary">
                                Your balance: <span className="font-medium">{creditBalance}</span> credits
                            </p>
                        </div>

                        {estimate?.breakdown && Object.keys(estimate.breakdown).length > 0 && (
                            <div className="flex flex-col gap-1 text-xs text-text-secondary border-t border-border pt-2">
                                {Object.entries(estimate.breakdown).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span>{key}</span>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isInsufficient && (
                            <p className="text-sm text-red-500 text-center">
                                Insufficient credits. You need {credits - creditBalance} more credits.
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
                                onClick={handleConfirm}
                                disabled={isConfirming || isInsufficient}
                            >
                                {isConfirming ? 'Processing...' : 'Confirm'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
