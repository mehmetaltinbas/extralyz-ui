import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { exerciseSetGroupsActions } from 'src/features/exercise-set-group/store/exercise-set-groups.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { AppDispatch } from 'src/store/store';

export function refreshExerciseSetsData() {
    return (dispatch: AppDispatch) => {
        dispatch(sourcesActions.fetchData());
        dispatch(exerciseSetsActions.fetchData());
        dispatch(exerciseSetGroupsActions.fetchData());
    };
}
