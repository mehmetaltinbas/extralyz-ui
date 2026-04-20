import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';
import type { UpdateSourceDto } from 'src/features/source/types/dto/update-source.dto';
import type { CreateSourceResponse } from 'src/features/source/types/response/create-source.response';
import type { GetSourcePdfResponse } from 'src/features/source/types/response/get-source-pdf.response';
import type { ReadAllSourcesResponse } from 'src/features/source/types/response/read-all-sources.response';
import type { ReadSingleSourceResponse } from 'src/features/source/types/response/read-single-source.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { EstimateResponse } from 'src/shared/types/estimate.response';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/source`;

export class SourceService {
    private constructor() {}

    static async create(formData: FormData): Promise<CreateSourceResponse> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/create`, formData)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async readById(id: string): Promise<ReadSingleSourceResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async readAllByUserId(): Promise<ReadAllSourcesResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-all-by-user-id`)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async updateById(id: string, dto: UpdateSourceDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.patch(`${baseUrl}/update-by-id/${id}`, dto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async getPdf(id: string): Promise<GetSourcePdfResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/get-pdf/${id}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async estimate(dto: CreateSourceDto): Promise<EstimateResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/estimate`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
