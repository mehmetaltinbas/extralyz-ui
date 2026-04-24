import { createSlice } from '@reduxjs/toolkit';
import { fetchSubscriptionData } from 'src/features/subscription/store/fetch-subscription-data.thunk';
import type { Subscription } from 'src/features/subscription/types/subscription.interface';

interface SubscriptionState {
    currentSubscription: Subscription | null;
    pendingSubscription: Subscription | null;
    isLoading: boolean;
}

const initialState: SubscriptionState = {
    currentSubscription: null,
    pendingSubscription: null,
    isLoading: false,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clear() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSubscriptionData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSubscriptionData.fulfilled, (_state, action) => {
                return {
                    currentSubscription: action.payload.currentSubscription,
                    pendingSubscription: action.payload.pendingSubscription,
                    isLoading: false,
                };
            });
    },
});

export const subscriptionActions = {
    ...subscriptionSlice.actions,
    fetchData: fetchSubscriptionData,
};

export const subscriptionReducer = subscriptionSlice.reducer;
