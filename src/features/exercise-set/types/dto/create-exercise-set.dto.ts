import type { ExerciseGenerationMode } from 'src/features/exercise-set/enums/exercise-generation-mode.enum';
import type { ExerciseSetContextType } from 'src/features/exercise-set/enums/exercise-set-context-type.enum';
import type { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import type { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';
import type { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';

export interface CreateExerciseSetDto {
    contextType: ExerciseSetContextType
    title: string;
    type: ExerciseSetType;
    difficulty: ExerciseSetDifficulty;
    count: number;
    visibility: ExerciseSetVisibility;
    generationMode: ExerciseGenerationMode;
}
