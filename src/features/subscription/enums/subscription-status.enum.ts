export enum SubscriptionStatus {
    ACTIVE = 'active', // current running subscription
    CANCELED = 'canceled', // marked for cancellation at end of billing cycle
    EXPIRED = 'expired', // previous subscription that has ended (downgrade cycle end, upgrade replacement, or grace period failure)
    PENDING_ACTIVATE = 'pendingActivate', // new plan waiting to activate at next billing cycle
    GRACE_PERIOD = 'gracePeriod', // payment failed, retrying (up to 3 attempts over 7 days)
}
