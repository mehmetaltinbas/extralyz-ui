import React from 'react';
import { PublicExerciseSetPopupsProvider } from 'src/features/exercise-set/components/PublicExerciseSetPopupsProvider';
import { PublicExerciseSetWorkspacePageContent } from 'src/features/exercise-set/pages/PublicExerciseSetWorkspacePageContent';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function PublicExerciseSetWorkspacePage({
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

    return exerciseSet && exercises ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <PublicExerciseSetPopupsProvider exerciseSet={exerciseSet} exercises={exercises} ownerUserName={ownerUserName} >
                    <PublicExerciseSetWorkspacePageContent
                        exerciseSet={exerciseSet}
                        exercises={exercises}
                        ownerUserName={ownerUserName}
                    />
            </PublicExerciseSetPopupsProvider>
        </div>
    ) : (
        <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>undefined</div>
    );
}
