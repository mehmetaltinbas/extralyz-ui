import type { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';

export interface PaymentMethod {
    _id: string;
    userId: string;
    provider: PaymentProviderName;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    holderName?: string;
    isDefault: boolean;
    createdAt: string;
}
