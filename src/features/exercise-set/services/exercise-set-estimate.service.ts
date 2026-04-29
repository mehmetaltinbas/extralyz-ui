import type { CreateExerciseSetDto } from 'src/features/exercise-set/types/dto/create-exercise-set.dto';
import type { EstimateEvaluatePaperAnswersDto } from 'src/features/exercise-set/types/dto/estimate-evaluate-paper-answers.dto';
import type { GenerateAdditionalExercisesDto } from 'src/features/exercise-set/types/dto/generate-additional-exercises.dto';
import type { GenerateNotesDto } from 'src/features/exercise-set/types/dto/generate-notes.dto';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { EstimateResponse } from 'src/shared/types/estimate.response';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/exercise-set-estimate`;

export class ExerciseSetEstimateService {
    private constructor() {}

    static async estimateCreate(contextId: string, dto: CreateExerciseSetDto): Promise<EstimateResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/estimate/${contextId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async estimateAdditional(exerciseSetId: string, dto: GenerateAdditionalExercisesDto): Promise<EstimateResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/estimate-additional/${exerciseSetId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async estimateEvaluatePaperAnswers(exerciseSetId: string, dto: EstimateEvaluatePaperAnswersDto): Promise<EstimateResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/estimate-evaluate-paper-answers/${exerciseSetId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async estimateGenerateNotes(exerciseSetId: string, dto: GenerateNotesDto): Promise<EstimateResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/estimate-generate-notes/${exerciseSetId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
