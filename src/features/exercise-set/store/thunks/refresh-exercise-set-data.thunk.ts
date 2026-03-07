import type { AppDispatch } from 'src/store/store';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';

export function refreshExerciseSetData() {
    return (dispatch: AppDispatch) => {
        dispatch(sourcesActions.fetchData());
        dispatch(exerciseSetsActions.fetchData());
    };
}
