import React from 'react';
import { paymentProviderFactory } from 'src/features/payment-method/strategies/provider/payment-provider.factory';
import type { PaymentMethod } from 'src/features/payment-method/types/payment-method.interface';
import { useAppSelector } from 'src/store/hooks';

export function PaymentMethodSelector({
    selectedPaymentMethodId,
    onSelect,
    onAddNew,
}: {
    selectedPaymentMethodId: string | null;
    onSelect: (paymentMethodId: string) => void;
    onAddNew?: () => void;
}) {
    const paymentMethods = useAppSelector((state) => state.paymentMethod.paymentMethods);
    const isLoading = useAppSelector((state) => state.paymentMethod.isLoading);

    React.useEffect(() => {
        const shouldAutoSelect = !selectedPaymentMethodId && paymentMethods.length > 0;
        if (shouldAutoSelect) {
            const preferred = paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0];
            onSelect(preferred._id);
        }
    }, [paymentMethods, selectedPaymentMethodId, onSelect]);

    const isInitialLoading = isLoading && paymentMethods.length === 0;
    const isEmpty = !isInitialLoading && paymentMethods.length === 0;

    return (
        <>
            {isInitialLoading ? (
                <p className="text-sm text-text-secondary">Loading payment methods...</p>
            ) : isEmpty ? (
                <div className="flex flex-col gap-2 p-3 rounded-md border border-border bg-surface">
                    <p className="text-sm text-text-secondary">
                        You don't have a payment method on file yet.
                    </p>
                    {onAddNew && (
                        <button
                            type="button"
                            onClick={onAddNew}
                            className="text-sm text-accent hover:underline self-start"
                        >
                            Add payment method
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {paymentMethods.map((method: PaymentMethod) => {
                        const brandIcon = paymentProviderFactory
                            .resolveStrategy(method.provider)
                            ?.getBrandIcon(method.brand);
                        const expLabel = `${String(method.expMonth).padStart(2, '0')}/${String(method.expYear).slice(-2)}`;
                        const isSelected = method._id === selectedPaymentMethodId;

                        return (
                            <label
                                key={method._id}
                                className={`flex items-center gap-3 p-2.5 rounded-md border cursor-pointer ${
                                    isSelected ? 'border-accent' : 'border-border'
                                } bg-surface`}
                            >
                                <input
                                    type="radio"
                                    name="payment-method"
                                    checked={isSelected}
                                    onChange={() => onSelect(method._id)}
                                />
                                {brandIcon}
                                <span className="text-sm font-medium">•••• {method.last4}</span>
                                <span className="text-xs text-text-secondary">exp {expLabel}</span>
                                {method.isDefault && (
                                    <span className="text-xs text-accent">Default</span>
                                )}
                            </label>
                        );
                    })}

                    {onAddNew && (
                        <button
                            type="button"
                            onClick={onAddNew}
                            className="text-sm text-accent hover:underline self-start"
                        >
                            + Add payment method
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
