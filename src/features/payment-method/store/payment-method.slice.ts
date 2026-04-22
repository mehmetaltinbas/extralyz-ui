import { createSlice } from '@reduxjs/toolkit';
import { fetchPaymentMethodsData } from 'src/features/payment-method/store/fetch-payment-methods-data.thunk';
import type { PaymentMethod } from 'src/features/payment-method/types/payment-method.interface';

interface PaymentMethodState {
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
}

const initialState: PaymentMethodState = {
    paymentMethods: [],
    isLoading: false,
};

const paymentMethodSlice = createSlice({
    name: 'paymentMethod',
    initialState,
    reducers: {
        clear() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPaymentMethodsData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPaymentMethodsData.fulfilled, (_state, action) => {
                return {
                    paymentMethods: action.payload.paymentMethods,
                    isLoading: false,
                };
            });
    },
});

export const paymentMethodActions = {
    ...paymentMethodSlice.actions,
    fetchData: fetchPaymentMethodsData,
};

export const paymentMethodReducer = paymentMethodSlice.reducer;
