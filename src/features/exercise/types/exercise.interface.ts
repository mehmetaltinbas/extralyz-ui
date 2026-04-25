import type { ExerciseDifficulty } from "src/features/exercise/enum/exercise-difficulty.enum";
import type { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";

export interface Exercise {
    _id: string;
    exerciseSetId: string;
    stem: string;
    type: ExerciseType;
    difficulty: ExerciseDifficulty;
    order: number; // index based integer
    choices?: string[];
    correctChoiceIndex?: number;
    solution?: string;
}
