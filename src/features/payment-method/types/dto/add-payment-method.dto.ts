import type { PaymentProviderName } from 'src/features/subscription/enums/payment-provider-name.enum';

export interface AddPaymentMethodDto {
    provider: PaymentProviderName;
    token: string;
}
