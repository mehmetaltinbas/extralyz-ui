import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import type { ReadAllExercisesResponse } from 'src/features/exercise/types/response/read-all-exercises.response';

const baseUrl = `/exercise`;

async function createByExerciseSetId(
    exerciseSetId: string,
    createExerciseDto: CreateExerciseDto
): Promise<ResponseBase> {
    console.log(createExerciseDto);
    const response = (
        await axiosInstance.post(
            `${baseUrl}/create-by-exercise-set-id/${exerciseSetId}`,
            createExerciseDto
        )
    ).data;
    return response;
}

async function readAll(): Promise<ReadAllExercisesResponse> {
    const response = (await axiosInstance.get(`${baseUrl}/read-all`)).data;
    return response;
}

async function readById() {}

async function readAllByExerciseSetId(
    exerciseSetId: string
): Promise<ReadAllExercisesResponse> {
    const response = (
        await axiosInstance.get(`${baseUrl}/read-all-by-exercise-set-id/${exerciseSetId}`)
    ).data;
    return response;
}

async function deleteById(id: string): Promise<ResponseBase> {
    const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;
    return response;
}

export const exerciseService = {
    createByExerciseSetId,
    readAll,
    readById,
    readAllByExerciseSetId,
    deleteById,
};
