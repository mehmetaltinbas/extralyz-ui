import type { ExerciseSetType } from "src/features/exercise-set/enums/exercise-set-type.enum";
import type { ExerciseSetDifficulty } from "src/features/exercise-set/enums/exericse-set-difficulty.enum";

export interface GenerateAdditionalExercisesDto {
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
    count: number;
}
