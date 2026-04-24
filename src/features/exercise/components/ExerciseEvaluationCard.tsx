import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
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
    const strategy = exerciseTypeFactory.resolveStrategy(exercise.type);

    return (
        <div
            className="w-80 sm:w-160 lg:w-200 h-auto px-2 sm:px-10 py-2 border-t border-b border-border
            flex flex-col justify-center items-start gap-0"
        >
            <p className="p-2 whitespace-pre-wrap">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>

            {strategy?.getRestOfExerciseEvaluationCard(exercise, evaluation)}
        </div>
    );
}
