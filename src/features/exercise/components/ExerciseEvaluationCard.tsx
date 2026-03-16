import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { resolveExerciseTypeStrategy } from 'src/features/exercise/strategies/type/resolve-exercise-type-strategy';
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
    const strategy = resolveExerciseTypeStrategy(exercise.type);

    return (
        <div
            className="w-full h-auto px-10 py-2 border-t border-b border-border
            flex flex-col justify-center items-center gap-0"
        >
            <p className="p-2">
                <span className="font-serif font-semibold">Exercise {index + 1}</span> -{' '}
                {exercise.prompt}
            </p>

            {strategy?.getRestOfExerciseEvaluationCard(exercise, evaluation)}
        </div>
    );
}
