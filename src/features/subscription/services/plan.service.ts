import type { ReadAllPlansResponse } from 'src/features/subscription/types/response/read-all-plans.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/plan`;

export class PlanService {
    private constructor() {}

    static async readAll(): Promise<ReadAllPlansResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-all`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
