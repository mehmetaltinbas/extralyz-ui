import type { CloneExerciseSetDto } from 'src/features/exercise-set/types/dto/clone-exercise-set.dto';
import type { EvaluateAnswersDto } from 'src/features/exercise-set/types/dto/evaluate-answers.dto';
import type { EvaluateAnswersResponse } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import type { GetPdfResponse } from 'src/features/exercise-set/types/response/get-pdf.response';
import type { ReadMultipleExerciseSetsResponse } from 'src/features/exercise-set/types/response/read-multiple-exercise-sets.response';
import type { ReadSingleExerciseSetResponse } from 'src/features/exercise-set/types/response/read-single-exercise-set.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/public-exercise-set`;

export class PublicExerciseSetService {
    private constructor() {}

    static async clone(exerciseSetId: string, dto: CloneExerciseSetDto): Promise<ResponseBase> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/clone/${exerciseSetId}`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readPublicById(exerciseSetId: string): Promise<ReadSingleExerciseSetResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-by-id/${exerciseSetId}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readAllPublicByUserName(userName: string): Promise<ReadMultipleExerciseSetsResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-all-by-user-name/${userName}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async evaluatePublicAnswers(
        dto: EvaluateAnswersDto
    ): Promise<EvaluateAnswersResponse> {
        try {
            const response = (
                await axiosInstance.post(`${baseUrl}/evaluate-answers`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async getPdf(id: string, withAnswers: boolean): Promise<GetPdfResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/get-pdf/${id}?withAnswers=${withAnswers}`)
            ).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }  

    static async evaluatePublicPaperAnswers(
        exerciseSetId: string,
        files: File[]
    ): Promise<EvaluateAnswersResponse> {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));

            const response = (
                await axiosInstance.post(
                    `${baseUrl}/evaluate-paper-answers/${exerciseSetId}`,
                    formData
                )
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
