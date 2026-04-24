import { createAsyncThunk } from '@reduxjs/toolkit';
import { SubscriptionService } from 'src/features/subscription/services/subscription.service';

export const fetchSubscriptionData = createAsyncThunk('subscription/fetch-data', async () => {
    const response = await SubscriptionService.readCurrent();

    return {
        currentSubscription: response.currentSubscription ?? null,
        pendingSubscription: response.pendingSubscription ?? null,
    };
});
