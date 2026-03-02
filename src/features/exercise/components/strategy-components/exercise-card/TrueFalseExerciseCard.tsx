import React from 'react';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function TrueFalseExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <p>{exercise.prompt}</p>
            {isAnswersHidden ? (
                <></>
            ) : (
                <p className="text-green-900">
                    Answer: {exercise.choices[exercise.correctChoiceIndex]}
                </p>
            )}
        </div>
    );
}
