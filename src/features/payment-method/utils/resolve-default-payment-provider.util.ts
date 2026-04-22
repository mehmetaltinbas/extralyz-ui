import { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';

export function resolveDefaultPaymentProvider(): PaymentProviderName {
    const raw = import.meta.env.VITE_DEFAULT_PAYMENT_PROVIDER;
    const isKnownProvider =
        !!raw && Object.values(PaymentProviderName).includes(raw as PaymentProviderName);
    return isKnownProvider ? (raw as PaymentProviderName) : PaymentProviderName.STRIPE;
}
