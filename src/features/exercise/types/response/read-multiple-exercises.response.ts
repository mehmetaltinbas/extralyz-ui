import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadMultipleExercisesResponse extends ResponseBase {
    exercises?: Exercise[];
}
