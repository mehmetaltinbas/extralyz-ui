import React from 'react';
import { PaymentMethodService } from 'src/features/payment-method/services/payment-method.service';
import { paymentMethodActions } from 'src/features/payment-method/store/payment-method.slice';
import { paymentProviderFactory } from 'src/features/payment-method/strategies/provider/payment-provider.factory';
import type { PaymentMethod } from 'src/features/payment-method/types/payment-method.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function PaymentMethodRow({
    method,
    canDelete,
    deleteBlockedReason,
}: {
    method: PaymentMethod;
    canDelete: boolean;
    deleteBlockedReason?: string;
}) {
    const dispatch = useAppDispatch();
    const [isBusy, setIsBusy] = React.useState(false);

    const brandIcon = paymentProviderFactory.resolveStrategy(method.provider)?.getBrandIcon(method.brand);
    const expLabel = `${String(method.expMonth).padStart(2, '0')}/${String(method.expYear).slice(-2)}`;

    async function handleSetDefault() {
        setIsBusy(true);
        const response = await PaymentMethodService.setDefault({ paymentMethodId: method._id });
        if (!response.isSuccess) {
            alert(response.message);
        } else {
            await dispatch(paymentMethodActions.fetchData());
        }
        setIsBusy(false);
    }

    async function handleDelete() {
        const confirmed = window.confirm('Delete this payment method?');
        if (confirmed) {
            setIsBusy(true);
            const response = await PaymentMethodService.delete(method._id);
            if (!response.isSuccess) {
                alert(response.message);
            } else {
                await dispatch(paymentMethodActions.fetchData());
            }
            setIsBusy(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 rounded-md border border-border bg-surface">
            <div className="flex items-center gap-3 flex-wrap">
                {brandIcon}
                <span className="text-sm font-medium">•••• {method.last4}</span>
                <span className="text-xs text-text-secondary">exp {expLabel}</span>
                {method.isDefault && (
                    <span className="text-xs font-medium text-accent px-2 py-0.5 border border-accent rounded-full">
                        Default
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {!method.isDefault && (
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={handleSetDefault}
                        disabled={isBusy}
                    >
                        Set as default
                    </Button>
                )}

                <span title={!canDelete ? deleteBlockedReason : undefined}>
                    <Button
                        variant={ButtonVariant.DANGER}
                        size={ButtonSize.SM}
                        onClick={handleDelete}
                        disabled={isBusy || !canDelete}
                    >
                        Delete
                    </Button>
                </span>
            </div>
        </div>
    );
}
