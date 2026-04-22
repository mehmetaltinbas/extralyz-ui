import type { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';

export interface AddPaymentMethodDto {
    provider: PaymentProviderName;
    token: string;
}
