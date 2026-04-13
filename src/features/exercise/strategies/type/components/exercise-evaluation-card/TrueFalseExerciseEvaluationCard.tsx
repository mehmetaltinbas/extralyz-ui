import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ScoreBadge } from 'src/features/exercise/components/ScoreBadge';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function TrueFalseExerciseEvaluationCard({
    exercise,
    evaluation,
}: {
    exercise: Exercise;
    evaluation: ExerciseAnswerEvaluationResult;
}) {
    const userAnswer =
        Number(evaluation.userAnswer) === 1
            ? 'True'
            : Number(evaluation.userAnswer) === 0
              ? 'False'
              : 'empty';
    const correctAnswer =
        exercise.correctChoiceIndex === 1
            ? 'True'
            : exercise.correctChoiceIndex === 0
              ? 'False'
              : undefined;

    return (
        <div className="flex flex-col justify-center items-center gap-1 text-center">
            <p>
                <span className="font-serif">Your answer</span>:{' '}
                <span className="text-text-secondary">{userAnswer}</span>
            </p>

            <p>
                <span className="font-serif">Correct answer</span>:{' '}
                <span className="text-text-correct">{correctAnswer}</span>
            </p>

            <ScoreBadge score={evaluation.score} label="Sub-score" />
        </div>
    );
}
