import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function MCQExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const optionLattersMap: Map<number, string> = new Map([
        [0, 'A'],
        [1, 'B'],
        [2, 'C'],
        [3, 'D'],
        [4, 'E'],
    ]);

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <p>{exercise.prompt}</p>

            <div className="flex flex-col justify-start items-start">
                {!isAnswersHidden && (
                    <p className="text-text-correct">
                        <span className='font-bold'>Answer:</span> {optionLattersMap.get(exercise.correctChoiceIndex!)}
                    </p>
                )}

                {exercise.choices!.map((choice, index) => (
                    <p className="text-sm">
                        {optionLattersMap.get(index)} - {choice}
                    </p>
                ))}
            </div>
        </div>
    );
}
