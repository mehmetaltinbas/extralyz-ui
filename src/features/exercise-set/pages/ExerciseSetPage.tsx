import React from 'react';
import { ExerciseSetPageContent } from 'src/features/exercise-set/components/ExerciseSetPageContent';
import { ExerciseSetPopupsProvider } from 'src/features/exercise-set/components/ExerciseSetPopupsProvider';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseSetPage({
    exerciseSet,
    exercises,
    className,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    className?: string;
}) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return exerciseSet && exercises ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${className ?? ''}`}
        >
            <ExerciseSetPopupsProvider containerRef={containerRef} exerciseSet={exerciseSet} exercises={exercises}>
                <ExerciseSetPageContent
                    exerciseSet={exerciseSet}
                    exercises={exercises}
                />
            </ExerciseSetPopupsProvider>
        </div>
    ) : (
        <div className={`${className ?? ''}`}>undefined</div>
    );
}
