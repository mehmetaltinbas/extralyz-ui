import type { PaymentMethod } from 'src/features/payment-method/types/payment-method.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadAllPaymentMethodsResponse extends ResponseBase {
    paymentMethods?: PaymentMethod[];
}
