import type { ReadMultipleExercisesResponse } from 'src/features/exercise/types/response/read-multiple-exercises.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/public-exercise`;

export class PublicExerciseService {
    private constructor() {}

    static async readAllPublicByExerciseSetId(
        exerciseSetId: string
    ): Promise<ReadMultipleExercisesResponse> {
        try {
            const response = (
                await axiosInstance.get(
                    `${baseUrl}/read-all-by-exercise-set-id/${exerciseSetId}`
                )
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
