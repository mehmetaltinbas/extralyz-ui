import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ReadAllSourcesResponse } from 'src/features/source/types/response/read-all-sources.response';
import type { ResponseBase } from 'src/shared/types/response-base';
import type { ReadSingleSourceResponse } from 'src/features/source/types/response/read-single-source.response';

const baseUrl = `/source`;

async function create(formData: FormData): Promise<ResponseBase> {
    const response = (await axiosInstance.post(`${baseUrl}/create`, formData)).data;

    return response;
}

async function readById(id: string): Promise<ReadSingleSourceResponse> {
    const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;

    return response;
}

async function readAllByUserId(): Promise<ReadAllSourcesResponse> {
    const response = (await axiosInstance.get(`${baseUrl}/read-all-by-user-id`)).data;

    return response;
}

async function deleteById(id: string): Promise<ResponseBase> {
    const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;

    return response;
}

export const sourceService = {
    create,
    readById,
    readAllByUserId,
    deleteById,
};
