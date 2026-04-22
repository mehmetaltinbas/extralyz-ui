import type { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';

export interface UpgradeSubscriptionDto {
    newPlanName: PlanName;
    paymentProvider?: PaymentProviderName;
    paymentMethodId?: string;
}
