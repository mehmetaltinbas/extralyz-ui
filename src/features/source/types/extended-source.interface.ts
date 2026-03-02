import type { Source } from 'src/features/source/types/source.interface';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

export interface ExtendedSource extends Source {
    exerciseSets?: ExerciseSet[];
}
