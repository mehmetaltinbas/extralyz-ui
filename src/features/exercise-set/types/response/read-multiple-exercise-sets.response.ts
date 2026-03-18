import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadMultipleExerciseSetsResponse extends ResponseBase {
    exerciseSets?: ExerciseSet[];
}
