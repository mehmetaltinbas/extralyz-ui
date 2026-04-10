import type { ExerciseSetSourceType } from "src/features/exercise-set/enums/exercise-set-source-type.enum";
import type { ExerciseSetType } from "src/features/exercise-set/enums/exercise-set-type.enum";
import type { ExerciseSetVisibility } from "src/features/exercise-set/enums/exercise-set-visibility.enum";
import type { ExerciseSetDifficulty } from "src/features/exercise-set/enums/exericse-set-difficulty.enum";

export interface ExerciseSet {
    _id: string;
    userId: string;
    sourceType: ExerciseSetSourceType;
    sourceId: string;
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
    count: number;
    title: string;
    visibility: ExerciseSetVisibility;
}
