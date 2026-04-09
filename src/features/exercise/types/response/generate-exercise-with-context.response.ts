import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface GenerateExerciseWithContextResponse extends ResponseBase {
    exercise?: Omit<Exercise, '_id' | 'exerciseSetId' | 'order'>;
}
