import type { ResponseBase } from 'src/shared/types/response-base';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

export interface ReadSingleExerciseSetResponse extends ResponseBase {
    exerciseSet?: ExerciseSet;
}
