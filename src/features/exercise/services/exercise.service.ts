import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import type { ReadAllExercisesResponse } from 'src/features/exercise/types/response/read-all-exercises.response';
import { handleServiceError } from 'src/shared/utilities/handle-service-error.util';

const baseUrl = `/exercise`;

async function createByExerciseSetId(
    exerciseSetId: string,
    createExerciseDto: CreateExerciseDto
): Promise<ResponseBase> {
    try {
        console.log(createExerciseDto);
        const response = (
            await axiosInstance.post(
                `${baseUrl}/create-by-exercise-set-id/${exerciseSetId}`,
                createExerciseDto
            )
        ).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readAll(): Promise<ReadAllExercisesResponse> {
    try {
        const response = (await axiosInstance.get(`${baseUrl}/read-all`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readById() {}

async function readAllByExerciseSetId(
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

async function deleteById(id: string): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const exerciseService = {
    createByExerciseSetId,
    readAll,
    readById,
    readAllByExerciseSetId,
    deleteById,
};
