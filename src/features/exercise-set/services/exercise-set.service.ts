import type { EvaluateAnswersDto } from 'src/features/exercise-set/types/dto/evaluate-answers.dto';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from '../../../shared/types/response-base';
import type { CreateExerciseSetDto } from '../types/dto/create-exercise-set.dto';
import type { ReadAllExerciseSetsResponse } from '../types/response/read-all-exercise-sets.response';
import type { ReadAllExerciseSetsGroupedBySources } from '../types/response/read-all-exerise-sets-grouped-by-sources.response';
import type { ReadSingleExerciseSetResponse } from '../types/response/read-single-exercise-set.response';

const baseUrl = `/exercise-set`;

async function create(
    sourceId: string | undefined,
    createExerciseSetDto: CreateExerciseSetDto
): Promise<ResponseBase> {
    const requestURL = sourceId ? `${baseUrl}/create/${sourceId}` : `${baseUrl}/create`;
    const response = (
        await axiosInstance.post(requestURL, createExerciseSetDto)
    ).data;
    return response;
}

async function readById(id: string): Promise<ReadSingleExerciseSetResponse> {
    const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;
    return response;
}

async function readAllByUserId(): Promise<ReadAllExerciseSetsResponse> {
    const response = (await axiosInstance.get(`${baseUrl}/read-all-by-user-id`)).data;
    return response;
}

async function readAllByUserIdGroupedBySources(): Promise<ReadAllExerciseSetsGroupedBySources> {
    const response = (
        await axiosInstance.get(`${baseUrl}/read-all-by-user-id-grouped-by-sources`)
    ).data;
    return response;
}

async function deleteById(id: string): Promise<ResponseBase> {
    const response = (await axiosInstance.delete(`${baseUrl}/delete-by-id/${id}`)).data;
    return response;
}

async function evaluateAnswers(
    evaluateAnswersDto: EvaluateAnswersDto
): Promise<EvaluateAnswersResponse> {
    const response = (
        await axiosInstance.post(`${baseUrl}/evaluate-answers`, evaluateAnswersDto)
    ).data;
    return response;
}

export const exerciseSetService = {
    create,
    readById,
    readAllByUserId,
    readAllByUserIdGroupedBySources,
    deleteById,
    evaluateAnswers,
};
