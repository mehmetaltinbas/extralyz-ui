import React from 'react';
import { PaymentMethodService } from 'src/features/payment-method/services/payment-method.service';
import { paymentMethodActions } from 'src/features/payment-method/store/payment-method.slice';
import { paymentProviderFactory } from 'src/features/payment-method/strategies/provider/payment-provider.factory';
import { resolveDefaultPaymentProvider } from 'src/features/payment-method/utils/resolve-default-payment-provider.util';
import { useAppDispatch } from 'src/store/hooks';

export function AddPaymentMethodForm({
    onCancel,
    onSuccess,
}: {
    onCancel: () => void;
    onSuccess?: () => void;
}) {
    const dispatch = useAppDispatch();

    const providerName = resolveDefaultPaymentProvider();
    const strategy = paymentProviderFactory.resolveStrategy(providerName);

    const [initPayload, setInitPayload] = React.useState<unknown>(null);
    const [isInitializing, setIsInitializing] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        if (!strategy) {
            setErrorMessage(`Payment provider "${providerName}" is not supported.`);
            setIsInitializing(false);
        } else {
            setIsInitializing(true);
            setErrorMessage(null);

            strategy.initializeAdd().then((result) => {
                if (!cancelled) {
                    if (result.isSuccess) {
                        setInitPayload(result.initPayload);
                    } else {
                        setErrorMessage(result.message || 'Could not initialize payment form.');
                    }
                    setIsInitializing(false);
                }
            });
        }

        return () => {
            cancelled = true;
        };
    }, [strategy, providerName]);

    async function handleTokenized(token: string) {
        const response = await PaymentMethodService.add({ provider: providerName, token });
        if (response.isSuccess) {
            await dispatch(paymentMethodActions.fetchData());
            onSuccess?.();
        } else {
            setErrorMessage(response.message);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {!strategy ? (
                <p className="text-sm text-accent">
                    {errorMessage ?? `Payment provider "${providerName}" is not supported.`}
                </p>
            ) : isInitializing ? (
                <p className="text-sm text-text-secondary">Preparing payment form...</p>
            ) : errorMessage && !initPayload ? (
                <>
                    <p className="text-sm text-accent">{errorMessage}</p>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-sm text-text-secondary hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}
                    {strategy.getAddCardForm({
                        initPayload,
                        onTokenized: handleTokenized,
                        onError: setErrorMessage,
                        onCancel,
                    })}
                </>
            )}
        </div>
    );
}
