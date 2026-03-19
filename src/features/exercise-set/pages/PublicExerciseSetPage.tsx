import React from 'react';
import { PublicExerciseSetPopupsProvider } from 'src/features/exercise-set/components/PublicExerciseSetPopupsProvider';
import { PublicExerciseSetPageContent } from 'src/features/exercise-set/pages/PublicExerciseSetPageContent';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function PublicExerciseSetPage({
    exerciseSet,
    exercises,
    ownerUserName,
    isActiveComponent,
}: {
    exerciseSet?: ExerciseSet;
    exercises?: Exercise[];
    ownerUserName: string;
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
                    <PublicExerciseSetPopupsProvider exerciseSet={exerciseSet} exercises={exercises} ownerUserName={ownerUserName} >
                            <PublicExerciseSetPageContent
                                exerciseSet={exerciseSet}
                                exercises={exercises}
                                ownerUserName={ownerUserName}
                            />
                    </PublicExerciseSetPopupsProvider>
                </div>
            ) : (
                <div>undefined</div>
            )}
        </div>
    );
}
