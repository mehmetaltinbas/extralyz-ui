import type { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import type { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import type { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';

export interface CreateExerciseSetDto {
    title: string;
    count: number;
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
    visibility: ExerciseSetVisibility;
}
