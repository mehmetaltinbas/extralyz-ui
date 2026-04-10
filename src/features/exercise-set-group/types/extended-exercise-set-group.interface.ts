import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { ExerciseSetGroup } from 'src/features/exercise-set-group/types/exercise-set-group.interface';

export interface ExtendedExerciseSetGroup extends ExerciseSetGroup {
    exerciseSets?: ExerciseSet[];
}
