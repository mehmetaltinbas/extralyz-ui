import { Elements } from '@stripe/react-stripe-js';
import { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';
import { PaymentMethodService } from 'src/features/payment-method/services/payment-method.service';
import { StripeAddCardFormBody } from 'src/features/payment-method/strategies/provider/components/add-card-form/StripeAddCardFormBody';
import type {
    PaymentProviderStrategy,
} from 'src/features/payment-method/strategies/provider/payment-provider-strategy.interface';
import type { GetAddCardFormProps } from 'src/features/payment-method/strategies/provider/types/props/get-add-card-form.props';
import type { InitializeAddResultResponse } from 'src/features/payment-method/strategies/provider/types/response/initialize-add-result.response';
import type { StripeInitPayload } from 'src/features/payment-method/strategies/provider/types/stripe-init-payload.interface';
import { getStripePromise } from 'src/features/payment-method/strategies/provider/utils/get-stripe-promise.util';

export class StripePaymentProviderStrategy implements PaymentProviderStrategy {
    provider = PaymentProviderName.STRIPE;

    async initializeAdd(): Promise<InitializeAddResultResponse> {
        const response = await PaymentMethodService.createSetupIntent();
        const isSuccess = response.isSuccess && !!response.clientSecret;
        return {
            isSuccess,
            message: response.message,
            initPayload: isSuccess
                ? ({ clientSecret: response.clientSecret } satisfies StripeInitPayload)
                : undefined,
        };
    }

    getAddCardForm({ initPayload, onTokenized, onError, onCancel }: GetAddCardFormProps) {
        const clientSecret = (initPayload as StripeInitPayload | undefined)?.clientSecret;

        return !clientSecret ? (
            <p className="text-sm text-text-secondary">Missing Stripe setup intent.</p>
        ) : (
            <Elements stripe={getStripePromise()} options={{ clientSecret }}>
                <StripeAddCardFormBody
                    clientSecret={clientSecret}
                    onTokenized={onTokenized}
                    onError={onError}
                    onCancel={onCancel}
                />
            </Elements>
        );
    }

    getBrandIcon(brand: string) {
        const label = brand?.toUpperCase() ?? '';
        return (
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-border text-text-secondary">
                {label}
            </span>
        );
    }
}
