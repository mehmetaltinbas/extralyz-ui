import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import type { AppDispatch } from 'src/store/store';

export function refreshExerciseSetsData() {
    return (dispatch: AppDispatch) => {
        dispatch(sourcesActions.fetchData());
        dispatch(exerciseSetsActions.fetchData());
    };
}
