import type { ExerciseSetContextType } from "src/features/exercise-set/enums/exercise-set-context-type.enum";
import type { ExerciseSetType } from "src/features/exercise-set/enums/exercise-set-type.enum";
import type { ExerciseSetVisibility } from "src/features/exercise-set/enums/exercise-set-visibility.enum";
import type { ExerciseSetDifficulty } from "src/features/exercise-set/enums/exericse-set-difficulty.enum";

export interface ExerciseSet {
    _id: string;
    userId: string;
    contextType: ExerciseSetContextType;
    contextId: string;
    title: string;
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
    count: number;
    visibility: ExerciseSetVisibility;
}
