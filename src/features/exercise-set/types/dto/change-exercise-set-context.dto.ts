import type { ExerciseSetContextType } from "src/features/exercise-set/enums/exercise-set-context-type.enum";

export interface ChangeExerciseSetContextDto {
    contextType: ExerciseSetContextType;
    contextId: string;
}
