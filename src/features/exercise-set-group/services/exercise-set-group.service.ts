import type { CreateExerciseSetGroupDto } from 'src/features/exercise-set-group/types/dto/create-exercise-set-group.dto';
import type { UpdateExerciseSetGroupDto } from 'src/features/exercise-set-group/types/dto/update-exercise-set-group.dto';
import type { ReadAllExerciseSetGroupsResponse } from 'src/features/exercise-set-group/types/response/read-all-exercise-set-groups.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/exercise-set-group`;

export class ExerciseSetGroupService {
    private constructor() {}

    static async create(dto: CreateExerciseSetGroupDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/create`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readAllByUserId(): Promise<ReadAllExerciseSetGroupsResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-all-by-user-id`)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async updateById(id: string, dto: UpdateExerciseSetGroupDto): Promise<ResponseBase> {
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
}
