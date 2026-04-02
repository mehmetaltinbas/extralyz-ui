import React from 'react';
import { ExerciseSetsPopupsProvider } from 'src/features/exercise-set/components/ExerciseSetsPopupsProvider';
import { ExerciseSetsPageContent } from 'src/features/exercise-set/pages/ExerciseSetsPageContent';
import { selectIndependentExerciseSets } from 'src/features/exercise-set/store/selectors/select-independent-exercise-sets';
import { refreshExerciseSetsData } from 'src/features/exercise-set/store/thunks/refresh-exercise-sets-data.thunk';
import { selectExtendedSources } from 'src/features/source/store/selectors/select-extended-sources';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function ExerciseSetsPage({ isActiveComponent }: { isActiveComponent: boolean }) {
    const dispatch = useAppDispatch();
    const independentExerciseSets = useAppSelector(selectIndependentExerciseSets);
    const extendedSources = useAppSelector(selectExtendedSources);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch(refreshExerciseSetsData());
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <ExerciseSetsPopupsProvider containerRef={containerRef}>
                <ExerciseSetsPageContent
                    independentExerciseSets={independentExerciseSets}
                    extendedSources={extendedSources}
                />
            </ExerciseSetsPopupsProvider>
        </div>
    );
}
