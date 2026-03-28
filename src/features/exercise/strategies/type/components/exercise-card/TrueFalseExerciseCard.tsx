import type { Exercise } from 'src/features/exercise/types/exercise.interface';

export function TrueFalseExerciseCard({
    exercise,
    isAnswersHidden,
}: {
    exercise: Exercise;
    isAnswersHidden: boolean;
}) {
    const answers: Record<number, string> = {
        [0]: "False",
        [1]: "True"
    };

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <p className='whitespace-pre-wrap'><span className='font-bold'>{exercise.order + 1}</span> - {exercise.prompt}</p>
            
            {!isAnswersHidden && (
                <p className="text-text-correct">
                    <span className='font-bold'>Answer:</span> {answers[exercise.correctChoiceIndex!]}
                </p>
            )}
        </div>
    );
}
