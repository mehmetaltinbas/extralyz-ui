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
            <p className='whitespace-pre-wrap'><span className='font-bold'>{exercise.order + 1}</span> - {exercise.stem}</p>

            {!isAnswersHidden && (
                <p className="text-text-correct whitespace-pre-wrap">
                    {exercise.solution}
                </p>
            )}
        </div>
    );
}
