import type { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import type { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';

export interface CreateExerciseSetDto {
    count: number;
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
}
