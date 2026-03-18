import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function OpenEndedExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <p><span className='font-bold'>{exercise.order + 1}</span> - {exercise.prompt}</p>

            {!isAnswersHidden && (
                <p className="text-text-correct">
                    <span className='font-bold'>Answer:</span> {exercise.solution}
                </p>
            )}
        </div>
    );
}
