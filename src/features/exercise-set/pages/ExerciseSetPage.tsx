import React from 'react';
import { ExerciseSetPopupsProvider } from 'src/features/exercise-set/components/ExerciseSetPopupsProvider';
import { ExerciseSetPageContent } from 'src/features/exercise-set/pages/ExerciseSetPageContent';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseSetPage({
    exerciseSet,
    exercises,
    isActiveComponent,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    isActiveComponent: boolean;
}) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className={`${isActiveComponent ? 'block' : 'hidden'} w-full h-full`}>
            {exerciseSet && exercises ? (
                <div
                    ref={containerRef}
                    className={`w-full h-full relative w-full h-full`}
                >
                    <ExerciseSetPopupsProvider containerRef={containerRef} exerciseSet={exerciseSet} exercises={exercises}>
                        <ExerciseSetPageContent
                            exerciseSet={exerciseSet}
                            exercises={exercises}
                        />
                    </ExerciseSetPopupsProvider>
                </div>
            ) : (
                <div>undefined</div>
            )}
        </div>
    );
}
