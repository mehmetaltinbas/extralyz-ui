import type { DowngradeSubscriptionDto } from 'src/features/subscription/types/dto/downgrade-subscription.dto';
import type { UpgradeSubscriptionDto } from 'src/features/subscription/types/dto/upgrade-subscription.dto';
import type { CheckPriceToPayResponse } from 'src/features/subscription/types/response/check-price-to-pay.response';
import type { ReadActiveSubscriptionResponse } from 'src/features/subscription/types/response/read-active-subscription.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/subscription`;

export class SubscriptionService {
    private constructor() {}

    static async readActive(): Promise<ReadActiveSubscriptionResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-active`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async upgrade(dto: UpgradeSubscriptionDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/upgrade`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async checkPriceToPayOnUpgrade(dto: UpgradeSubscriptionDto): Promise<CheckPriceToPayResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/check-price-to-pay-on-upgrade`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async downgrade(dto: DowngradeSubscriptionDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/downgrade`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async cancelDowngrade(): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/cancel-downgrade`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
