import type { CloneSourceDto } from 'src/features/source/types/dto/clone-source.dto';
import type { GetSourcePdfResponse } from 'src/features/source/types/response/get-source-pdf.response';
import type { ReadAllSourcesResponse } from 'src/features/source/types/response/read-all-sources.response';
import type { ReadSingleSourceResponse } from 'src/features/source/types/response/read-single-source.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/public-source`;

export class PublicSourceService {
    private constructor() {}

    static async clone(sourceId: string, dto: CloneSourceDto): Promise<ResponseBase> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/clone/${sourceId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readPublicById(sourceId: string): Promise<ReadSingleSourceResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-by-id/${sourceId}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readAllPublicByUserName(userName: string): Promise<ReadAllSourcesResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-all-by-user-name/${userName}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async getPdf(sourceId: string): Promise<GetSourcePdfResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/get-pdf/${sourceId}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
