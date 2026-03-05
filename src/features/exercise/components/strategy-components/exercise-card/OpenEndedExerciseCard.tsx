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
            <p>{exercise.prompt}</p>

            {isAnswersHidden && (
                <p className="text-green-900">
                    <span className='font-bold'>Answer:</span> {exercise.solution}
                </p>
            )}
        </div>
    );
}
