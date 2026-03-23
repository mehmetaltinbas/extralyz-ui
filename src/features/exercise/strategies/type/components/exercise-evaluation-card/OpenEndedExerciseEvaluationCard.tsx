import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ScoreBadge } from 'src/features/exercise/components/ScoreBadge';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function OpenEndedExerciseEvaluationCard({
    exercise,
    evaluation,
}: {
    exercise: Exercise;
    evaluation: ExerciseAnswerEvaluationResult;
}) {
    return (
        <div className="flex flex-col justify-center items-center gap-1 text-center">
            <p className='whitespace-pre-wrap'>
                <span className="font-serif">Your answer</span>:{' '}
                <span className="text-text-secondary">{evaluation.userAnswer}</span>
            </p>

            <p className='whitespace-pre-wrap'>
                <span className="font-serif">Correct answer</span>:{' '}
                <span className="text-text-correct">{exercise.solution}</span>
            </p>

            <p className='whitespace-pre-wrap'>
                <span className="font-serif">Feedback</span>: {evaluation.feedback}
            </p>

            <ScoreBadge score={evaluation.score} label="Sub-score" />
        </div>
    );
}
