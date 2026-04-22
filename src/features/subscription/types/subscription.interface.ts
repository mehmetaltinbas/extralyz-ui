import type { PaymentProviderName } from 'src/features/payment-method/enums/payment-provider-name.enum';
import type { SubscriptionStatus } from 'src/features/subscription/enums/subscription-status.enum';
import type { Plan } from 'src/features/subscription/types/plan.interface';

export interface Subscription {
    _id: string;
    plan: Plan;
    nextBillingDate: string;
    status: SubscriptionStatus;
    paymentRetryCount: number;
    startedAt?: string;
    canceledAt?: string;
    endedAt?: string;
    gracePeriodEnd?: string;
    lastPaymentProvider?: PaymentProviderName;
}
