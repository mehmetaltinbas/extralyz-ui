import type React from 'react';
import { MCQExercisePracticeCard } from 'src/features/exercise/components/strategy-components/exercise-practice-card/MCQExercisePracticeCard';
import { OpenEndedExercisePracticeCard } from 'src/features/exercise/components/strategy-components/exercise-practice-card/OpenEndedExercisePracticeCard';
import { TrueFalseExercisePracticeCard } from 'src/features/exercise/components/strategy-components/exercise-practice-card/TrueFalseExercisePracticeCard';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExercisePracticeCard({
    exercise,
    index,
    recordAnswer,
    className,
}: {
    exercise: Exercise;
    index: number;
    recordAnswer: (exerciseId: string, answer: string | number) => void;
    className?: string;
}) {
    const componentsMap: Map<
        ExerciseType,
        React.ComponentType<{
            exercise: Exercise;
            index: number;
            recordAnswer: (exerciseId: string, answer: string | number) => void;
        }>
    > = new Map([
        [ExerciseType.MCQ, MCQExercisePracticeCard],
        [ExerciseType.TRUE_FALSE, TrueFalseExercisePracticeCard],
        [ExerciseType.OPEN_ENDED, OpenEndedExercisePracticeCard],
    ]);
    const Component = componentsMap.get(exercise.type as ExerciseType);

    return (
        <div
            className={`w-[400px] md:w-[600px] h-auto p-2
            flex flex-col justify-center items-center gap-2
            ${className ?? ''}`}
        >
            <p className="border-b p-2">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>
            {Component && (
                <Component exercise={exercise} index={index} recordAnswer={recordAnswer} />
            )}
        </div>
    );
}
