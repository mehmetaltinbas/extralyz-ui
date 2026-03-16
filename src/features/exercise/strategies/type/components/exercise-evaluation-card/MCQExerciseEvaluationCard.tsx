import type { ExerciseAnswerEvaluationResult } from 'src/features/exercise-set/types/response/evaluate-answers.response';
import { ScoreBadge } from 'src/features/exercise/components/ScoreBadge';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { getAlphabetLetter } from 'src/shared/utils/get-alphabet-letter.util';

export function MCQExerciseEvaluationCard({
    exercise,
    evaluation,
}: {
    exercise: Exercise;
    evaluation: ExerciseAnswerEvaluationResult;
}) {
    const userAnswer = exercise.choices!.find(
        (choice, index) => index === Number(evaluation.userAnswer)
    );
    
    const correctAnswer = exercise.choices!.find(
        (choice, index) => index === exercise.correctChoiceIndex
    );

    return (
        <div className="flex flex-col justify-center items-center gap-1 text-center">
            <p>
                <span className="font-serif">Your answer</span>:{' '}
                <span className="text-text-secondary">{getAlphabetLetter(Number(evaluation.userAnswer))} - {userAnswer}</span>
            </p>

            <p>
                <span className="font-serif">Correct answer</span>:{' '}
                <span className="text-text-correct">{getAlphabetLetter(exercise.correctChoiceIndex!)} - {correctAnswer}</span>
            </p>

            <ScoreBadge score={evaluation.score} label="Sub-score" />
        </div>
    );
}
