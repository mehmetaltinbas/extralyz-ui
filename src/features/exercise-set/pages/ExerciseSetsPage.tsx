import React from 'react';
import { ExerciseSetCard } from 'src/features/exercise-set/components/ExerciseSetCard';
import { ExerciseSetsPopupsProvider } from 'src/features/exercise-set/components/ExerciseSetsPopupsProvider';
import { useExerciseSetsPopups } from 'src/features/exercise-set/hooks/use-exercise-sets-popups.hook';
import { selectIndependentExerciseSets } from 'src/features/exercise-set/store/selectors/select-independent-exercise-sets';
import { refreshExerciseSetData } from 'src/features/exercise-set/store/thunks/refresh-exercise-set-data.thunk';
import { selectExtendedSources } from 'src/features/source/store/selectors/select-extended-sources';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import type { RootState } from 'src/store/store';

export function ExerciseSetsPage({ className }: { className?: string }) {
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
            className={`relative w-full h-full ${className ?? ''}`}
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

function ExerciseSetsPageContent({
    layoutDimensions,
    independentExerciseSets,
    extendedSources,
}: {
    layoutDimensions: RootState['layoutDimensions'];
    independentExerciseSets: ReturnType<typeof selectIndependentExerciseSets>;
    extendedSources: ReturnType<typeof selectExtendedSources>;
}) {
    const { openCreateExerciseSetForm } = useExerciseSetsPopups();

    return (
        <div
            className={`absolute w-full h-full p-4
            flex flex-col justify-start items-center`}
        >
            <div
                className="relative w-full h-[auto]
                flex flex-col justify-center items-center p-4"
            >
                <p className="text-2xl font-bold">Exercise Sets</p>

                <div className="absolute right-0">
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={openCreateExerciseSetForm}
                    >
                        new exercise set
                    </Button>
                </div>
            </div>

            <div
                className="w-full h-auto p-4
                flex flex-col justify-start items-start gap-10"
            >
                <div
                    className="w-full h-auto p-4
                    flex flex-col justify-start items-start gap-4"
                >
                    <div className="w-full flex justify-start items-center gap-2 border-b-1">
                        <p className="font-serif font-semibold">Independents</p>
                    </div>

                    <div
                        className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto pb-1`}
                    >
                        {independentExerciseSets.map((exerciseSet) => (
                            <ExerciseSetCard
                                key={`exercise-set-card-${exerciseSet._id}`}
                                exerciseSet={exerciseSet}
                            />
                        ))}
                    </div>
                </div>

                {extendedSources.map((extendedSource) => (
                    <React.Fragment key={`extended-source-${extendedSource._id}`}>
                        {extendedSource.exerciseSets &&
                            extendedSource.exerciseSets.length > 0 && (
                                <div
                                    className="w-full h-auto p-4
                                        flex flex-col justify-start items-start gap-4"
                                >
                                    <div className="w-full flex justify-start items-center gap-2 border-b-1">
                                        <p className="font-serif font-semibold">
                                            Source:{' '}
                                        </p>
                                        <p>
                                            {extendedSource.title ||
                                            extendedSource.title.length > 0
                                                ? extendedSource.title
                                                : extendedSource._id}
                                        </p>
                                        <p className="font-serif italic">
                                            {extendedSource.type}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-[${layoutDimensions.exerciseSetsContainer.width}px] flex justify-start items-center gap-4 overflow-x-auto pb-1`}
                                    >
                                        {extendedSource.exerciseSets &&
                                            extendedSource.exerciseSets.map(
                                                (exerciseSet) => (
                                                    <ExerciseSetCard
                                                        key={`exercise-set-card-${exerciseSet._id}`}
                                                        exerciseSet={exerciseSet}
                                                    />
                                                )
                                            )}
                                    </div>
                                </div>
                            )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
