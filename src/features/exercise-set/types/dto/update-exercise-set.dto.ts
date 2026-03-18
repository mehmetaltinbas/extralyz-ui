import type { ExerciseSetVisibility } from 'src/features/exercise-set/enums/exercise-set-visibility.enum';

export interface UpdateExerciseSetDto {
    title?: string;
    visibility?: ExerciseSetVisibility;
}
