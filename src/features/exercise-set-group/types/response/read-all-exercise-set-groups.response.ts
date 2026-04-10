import type { ExerciseSetGroup } from 'src/features/exercise-set-group/types/exercise-set-group.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadAllExerciseSetGroupsResponse extends ResponseBase {
    exerciseSetGroups?: ExerciseSetGroup[];
}
