import type { CreateFeedbackDto } from "src/features/feedback/types/dto/create-feedback.dto";
import { axiosInstance } from "src/shared/api/axios-instance";
import type { ResponseBase } from "src/shared/types/response-base.interface";
import { handleServiceError } from "src/shared/utils/handle-service-error.util";

const baseUrl = `/feedback`;

export class FeedbackService {
    private constructor() {}

    static async create(dto: CreateFeedbackDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/create`, dto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
