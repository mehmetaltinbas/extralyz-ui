import type { ExerciseSetSourceType } from 'src/features/exercise-set/enums/exercise-set-source-type.enum';
import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import type { EvaluateAnswersDto } from 'src/features/exercise-set/types/dto/evaluate-answers.dto';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import type { ReadAllExerciseSetsResponse } from 'src/features/exercise-set/types/response/read-all-exercise-sets.response';
import type { ReadAllExerciseSetsGroupedBySources } from 'src/features/exercise-set/types/response/read-all-exerise-sets-grouped-by-sources.response';
import type { ReadSingleExerciseSetResponse } from 'src/features/exercise-set/types/response/read-single-exercise-set.response';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/util/handle-service-error.util';

const baseUrl = `/exercise-set`;

async function create(
    sourceId: string | undefined,
    createExerciseSetDto: CreateExerciseSetDto
): Promise<ResponseBase> {
    try {
        const requestURL = sourceId ? `${baseUrl}/create/${sourceId}` : `${baseUrl}/create`;
        const response = (await axiosInstance.post(requestURL, createExerciseSetDto)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readById(id: string): Promise<ReadSingleExerciseSetResponse> {
    try {
        const response = (await axiosInstance.get(`${baseUrl}/read-by-id/${id}`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readAllByUserId(
    sourceType?: ExerciseSetSourceType
): Promise<ReadAllExerciseSetsResponse> {
    try {
        const response = (
            await axiosInstance.get(
                `${baseUrl}/read-all-by-user-id${sourceType ? `?sourceType=${sourceType}` : ''}`
            )
        ).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readAllByUserIdGroupedBySources(): Promise<ReadAllExerciseSetsGroupedBySources> {
    try {
        const response = (
            await axiosInstance.get(`${baseUrl}/read-all-by-user-id-grouped-by-sources`)
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

async function evaluateAnswers(
    evaluateAnswersDto: EvaluateAnswersDto
): Promise<EvaluateAnswersResponse> {
    try {
        const response = (
            await axiosInstance.post(`${baseUrl}/evaluate-answers`, evaluateAnswersDto)
        ).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const exerciseSetService = {
    create,
    readById,
    readAllByUserId,
    readAllByUserIdGroupedBySources,
    deleteById,
    evaluateAnswers,
};
