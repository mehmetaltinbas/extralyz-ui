import React from 'react';
import { ExerciseSetsPopupsProvider } from 'src/features/exercise-set/components/ExerciseSetsPopupsProvider';
import { ExerciseSetsPageContent } from 'src/features/exercise-set/pages/ExerciseSetsPageContent';
import { selectIndependentExerciseSets } from 'src/features/exercise-set/store/selectors/select-independent-exercise-sets';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import { selectExtendedSources } from 'src/features/source/store/selectors/select-extended-sources';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function ExerciseSetsPage({ isActiveComponent }: { isActiveComponent: boolean }) {
    const dispatch = useAppDispatch();
    const layoutDimensions = useAppSelector((state) => state.layoutDimensions);
    const independentExerciseSets = useAppSelector(selectIndependentExerciseSets);
    const extendedSources = useAppSelector(selectExtendedSources);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch(refreshExerciseSetData());
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <ExerciseSetsPopupsProvider containerRef={containerRef}>
                <ExerciseSetsPageContent
                    layoutDimensions={layoutDimensions}
                    independentExerciseSets={independentExerciseSets}
                    extendedSources={extendedSources}
                />
            </ExerciseSetsPopupsProvider>
        </div>
    );
}
