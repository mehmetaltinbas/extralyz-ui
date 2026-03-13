import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import type { TransferExerciseDto } from 'src/features/exercise/types/dto/transfer-exercise.dto';
import type { UpdateExerciseDto } from 'src/features/exercise/types/dto/update-exercise.dto';
import type { ReadAllExercisesResponse } from 'src/features/exercise/types/response/read-all-exercises.response';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/exercise`;

export class ExerciseService {
    private constructor() {}

    static async createByExerciseSetId(
        exerciseSetId: string,
        dto: CreateExerciseDto
    ): Promise<ResponseBase> {
        try {
            console.log(dto);
            const response = (
                await axiosInstance.post(
                    `${baseUrl}/create-by-exercise-set-id/${exerciseSetId}`,
                    dto
                )
            ).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async readById(id: string) {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async readAllByExerciseSetId(
        exerciseSetId: string
    ): Promise<ReadAllExercisesResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-all-by-exercise-set-id/${exerciseSetId}`)
            ).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async updateById(id: string, dto: UpdateExerciseDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.patch(`${baseUrl}/update-by-id/${id}`, dto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    
    static async transfer(id: string, dto: TransferExerciseDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/transfer/${id}`, dto)).data;
    
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
