import type { UpdateSourceDto } from 'src/features/source/types/dto/update-source.dto';
import type { ReadAllSourcesResponse } from 'src/features/source/types/response/read-all-sources.response';
import type { ReadSingleSourceResponse } from 'src/features/source/types/response/read-single-source.response';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/util/handle-service-error.util';

const baseUrl = `/source`;

async function create(formData: FormData): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.post(`${baseUrl}/create`, formData)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readById(id: string): Promise<ReadSingleSourceResponse> {
    try {
        const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readAllByUserId(): Promise<ReadAllSourcesResponse> {
    try {
        const response = (await axiosInstance.get(`${baseUrl}/read-all-by-user-id`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function updateById(id: string, dto: UpdateSourceDto): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.patch(`${baseUrl}/update-by-id/${id}`, dto)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function deleteById(id: string): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const sourceService = {
    create,
    readById,
    readAllByUserId,
    updateById,
    deleteById,
};
