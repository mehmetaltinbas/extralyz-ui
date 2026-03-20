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

    return exerciseSet && exercises ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <ExerciseSetPopupsProvider containerRef={containerRef} exerciseSet={exerciseSet} exercises={exercises}>
                <ExerciseSetPageContent
                    exerciseSet={exerciseSet}
                    exercises={exercises}
                />
            </ExerciseSetPopupsProvider>
        </div>
    ) : (
        <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>undefined</div>
    );
}
