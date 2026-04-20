import { createAsyncThunk } from '@reduxjs/toolkit';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';

export const fetchSubscriptionData = createAsyncThunk('subscription/fetch-data', async () => {
    const response = await SubscriptionService.readActive();

    return {
        subscription: response.subscription ?? null,
        pendingSubscription: response.pendingSubscription ?? null,
    };
});
