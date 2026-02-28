import type React from 'react';
import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { MCQExerciseEvaluationCard } from 'src/features/exercise/components/strategy-components/exercise-evaluation-card/MCQExerciseEvaluationCard';
import { OpenEndedExerciseEvaluationCard } from 'src/features/exercise/components/strategy-components/exercise-evaluation-card/OpenEndedExerciseEvaluationCard';
import { TrueFalseExerciseEvaluationCard } from 'src/features/exercise/components/strategy-components/exercise-evaluation-card/TrueFalseExerciseEvaluationCard';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function ExerciseEvaluationCard({
    exercise,
    evaluation,
    index,
}: {
    exercise: Exercise;
    evaluation: ExerciseAnswerEvaluationResult;
    index: number;
}) {
    const componentsMap: Map<
        ExerciseType,
        React.ComponentType<{
            exercise: Exercise;
            evaluation: ExerciseAnswerEvaluationResult;
            index: number;
        }>
    > = new Map([
        [ExerciseType.MCQ, MCQExerciseEvaluationCard],
        [ExerciseType.TRUE_FALSE, TrueFalseExerciseEvaluationCard],
        [ExerciseType.OPEN_ENDED, OpenEndedExerciseEvaluationCard]
    ]);
    const Component = componentsMap.get(exercise.type as ExerciseType);

    return (
        <div
            className="w-full h-auto px-10 py-2 border-t border-b
            flex flex-col justify-center items-center gap-2"
        >
            <p className="p-2">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>
            {Component && (
                <Component exercise={exercise} evaluation={evaluation} index={index} />
            )}
        </div>
    );
}
