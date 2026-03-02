import type { ResponseBase } from 'src/shared/types/response-base';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export interface ReadAllExercisesResponse extends ResponseBase {
    exercises?: Exercise[];
}
