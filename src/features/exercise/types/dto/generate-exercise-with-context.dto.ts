import type { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import type { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';

export interface GenerateExerciseWithContextDto {
    context: string;
    type: ExerciseType;
    difficulty: ExerciseDifficulty;
}
