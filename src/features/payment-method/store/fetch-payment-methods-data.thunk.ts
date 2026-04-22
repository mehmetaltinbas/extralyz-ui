import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentMethodService } from 'src/features/payment-method/services/payment-method.service';

export const fetchPaymentMethodsData = createAsyncThunk('payment-method/fetch-data', async () => {
    const response = await PaymentMethodService.readAll();

    return {
        paymentMethods: response.paymentMethods ?? [],
    };
});
