import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Source } from 'src/features/source/types/source.interface';

export interface ExtendedSource extends Source {
    exerciseSets?: ExerciseSet[];
}
