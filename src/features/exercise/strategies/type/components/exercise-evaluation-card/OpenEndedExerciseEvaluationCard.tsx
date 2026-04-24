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
        <div className="w-full flex flex-col justify-center items-center gap-1">
            <div className='w-full flex justify-start items-center gap-4'>
                <p className="w-[120px] shrink-0 font-serif whitespace-nowrap">Your answer:{' '}</p>

                <p className="w-full text-text-secondary">{evaluation.userAnswer}</p>
            </div>

            <span className='w-full h-[1px] bg-gray-200'></span>

            <div className='w-full flex justify-start items-center gap-4'>
                <p className="w-[120px] shrink-0 font-serif whitespace-nowrap">Correct answer:{' '}</p>

                <p className="w-full text-text-correct">{exercise.solution}</p>
            </div>

            <span className='w-full h-[1px] bg-gray-200'></span>

            <div className='w-full flex justify-start items-center gap-4'>
                <p className="w-[120px] shrink-0 font-serif whitespace-nowrap">Feedback:{` `}</p>

                <p className="w-full">{evaluation.feedback}</p>
            </div>

            <ScoreBadge score={evaluation.score} label="Sub-score" />
        </div>
    );
}
