import type { ResponseBase } from 'src/shared/types/response-base.interface';
import type { Subscription } from 'src/features/subscription/types/subscription.interface';

export interface ReadActiveSubscriptionResponse extends ResponseBase {
    subscription?: Subscription;
    pendingSubscription?: Subscription;
}
