import type { AddPaymentMethodDto } from 'src/features/payment-method/types/dto/add-payment-method.dto';
import type { SetDefaultPaymentMethodDto } from 'src/features/payment-method/types/dto/set-default-payment-method.dto';
import type { AddPaymentMethodResponse } from 'src/features/payment-method/types/response/add-payment-method.response';
import type { CreateSetupIntentResponse } from 'src/features/payment-method/types/response/create-setup-intent.response';
import type { ReadAllPaymentMethodsResponse } from 'src/features/payment-method/types/response/read-all-payment-methods.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/payment-method`;

export class PaymentMethodService {
    private constructor() {}

    static async readAll(): Promise<ReadAllPaymentMethodsResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-all`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async add(dto: AddPaymentMethodDto): Promise<AddPaymentMethodResponse> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/add`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async setDefault(dto: SetDefaultPaymentMethodDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/set-default`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async delete(paymentMethodId: string): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.delete(`${baseUrl}/${paymentMethodId}`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async createSetupIntent(): Promise<CreateSetupIntentResponse> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/setup-intent`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
