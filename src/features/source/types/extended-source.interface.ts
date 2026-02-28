import type { Source } from './source.interface';
import type { ExerciseSet } from '../../exercise-set/types/exercise-set.interface';

export interface ExtendedSource extends Source {
    exerciseSets?: ExerciseSet[];
}
