import type { ExerciseDifficulty } from "src/features/exercise/enum/exercise-difficulty.enum";
import type { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";

export interface Exercise {
    _id: string;
    sourceId: string;
    type: ExerciseType;
    choices: string[];
    correctChoiceIndex: number;
    difficulty: ExerciseDifficulty;
    prompt: string;
    solution: string;
}
