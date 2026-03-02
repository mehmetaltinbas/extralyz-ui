import type { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import type { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';

export interface CreateExerciseDto {
    type: ExerciseType;
    difficulty: ExerciseDifficulty;
    prompt: string;
    solution?: string;
    choices?: string[];
    correctChoiceIndex?: number;
}
