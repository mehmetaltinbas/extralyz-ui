import type { Subscription } from 'src/features/subscription/types/subscription.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadCurrentSubscriptionResponse extends ResponseBase {
    currentSubscription?: Subscription;
    pendingSubscription?: Subscription;
}
